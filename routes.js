exports.setRequestUrl = (app) => {
    const notes = require('./controllers/notes');
    const groups = require('./controllers/groups');

    app.get('/notes', notes.getNotes);
    app.post('/note', notes.setNote);
    app.delete('/note/:id', notes.deleteNote)
    app.get('/groups', groups.getGroups);
    app.post('/group', groups.setGroup)
    app.delete('/group/:id', groups.deleteGroup)
}