const Note = require('../models/note')

const addNote = async (req, res) => {
    if (req.session.user) {
        Note.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.session.user.user_id
        })
        .then(note => {
            res.json({
                message: 'New note is created', 
                note: note
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Error adding note' });
        });
    } else {
        res.status(401).json({ message: 'User is not logged in' });
    }
};

const getAllNotes = async (req, res) => {
    if (req.session.user) {
        Note.findAll({
            where: {
                userId: req.session.user.user_id
            } 
        })
        .then(notes => { 
            res.json(notes)
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json({ message: 'Error getting notes' });
        });
    } else {
        res.status(401).json({ message: 'User is not logged in' });
    }
};

module.exports = { addNote, getAllNotes };