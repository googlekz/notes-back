const config = require('../config');
const pool = config.pool;

exports.getGroups = async (request, response) => {
    const groups = await pool.query('SELECT * FROM groups ORDER BY id ASC');
    const notesAndGroups = await pool.query('SELECT * FROM groups_Notes');
    const res = groups.rows.map(group => {
        return {
            ...group,
            count_notes: notesAndGroups.rows.filter(item => item['group_id'] === group.id).length
        }
    })
    response.status(200).json(res)
};

exports.setGroup = async (request, response) => {
    const { name } = request.body;

    pool.query('INSERT INTO groups (name) VALUES ($1)', [name], (error, results) => {
        if (error) throw error
        response.status(200).send(`Ghost added with ID: ${results.rows}`);
    })
}

exports.deleteGroup = async (request, response) => {
    const idGroup = parseInt(request.params.id);

    pool.query(`DELETE FROM groups WHERE id = $1`, [idGroup])
    pool.query(`DELETE FROM groups_notes WHERE group_id = $1`, [idGroup])
    response.status(200).send(`DELETE group`);
}