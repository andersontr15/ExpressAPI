const PORT = process.env.PORT || 3000;
const DB = "mongodb://localhost:27017/expressApi";
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let router = express.Router();
let Model = mongoose.model('User', new mongoose.Schema({
    name: String,
    age: Number
}));

router.put('/users/:id', function(request, response, next) {
    console.log('in update');
    Model.update({ _id: request.params.id }, {
     $set: {
         name: request.body.name,
         age: request.body.age
     }   
    }, function(err, user) {
        if (err) {
            return response.status(404).send(err)
        } else {
            return response.status(200).send({
                message: 'successfully updated the resource'
            });
        }
    });
});


router.delete('/users/:id', function(request, response, next) {
    console.log('in delete');
    Model.remove({ _id: request.params.id }, function(err, user) {
        if (err) {
            return response.status(500).send(err)
        } else {
            return response.status(200).send({
                message: 'successfully deleted ' + request.params.id
            });
        }
    });
});



router.post('/users', function(request, response, next) {
    var data = request.body;
    var User = new Model(data);
    User.save(function(err, user) {
        if (err) {
            return response.status(500).send(err)
        } else {
            return response.status(201).send({
                message: 'you have created a resource',
                user: user
            });
        }
    });
});


router.get('/users', function(request, response, next) {
    Model.find({}, function(err, documents) {
        if (err) {
            return response.status(404).send(err);
        } else {
            return response.status(200).send(documents)
        }
    });
});
router.get('/users/:id', function(request, response, next) {
    Model.findById(request.params.id, function(err, document) {
        if (err) {
            return response.status(404).send(err);
        } else {
            if (!document) {
                return response.status(404).send({
                    message: 'No user exits with this id'
                });
            } else {
                return response.status(200).send(document);
            }
        }
    });
});

app.use('/api', router);

mongoose.connect(DB, function(err, db) {
    if (err) {
        return err;
    } else {
        console.log('Successfully made a connection to ' + DB);
    }
});
app.listen(PORT, function() {
    console.log('Listening on port ' + PORT);
});