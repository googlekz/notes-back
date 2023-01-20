const config = require('../config');
const pool = config.pool;

exports.getNotes = async (request, response) => {
    const { group } = request.query;
    const notes = group
        ? await pool.query(`
                SELECT notes.*
                FROM notes, groups_notes
                WHERE note_id = notes.id and group_id = ${group};
        `)
        : await pool.query('SELECT * FROM notes ORDER BY id DESC');
    let notesRows = notes.rows;
    const groupsArr = await getGroupsFromArray(notesRows);
    notesRows.forEach((item, index) => {
        notesRows[index] = {
            ...item,
            groups: groupsArr[index] || []
        }
    })
    response.status(200).json(notesRows)
};

exports.deleteNote = async (request, response) => {
    const idNote = parseInt(request.params.id);

    pool.query(`DELETE FROM notes WHERE id = $1`, [idNote])
    pool.query(`DELETE FROM groups_notes WHERE note_id = $1`, [idNote])
    response.status(200).send('Удалилось');
}

exports.setNote = async (request, response) => {
    const {title, text, groups, background} = request.body;
    pool.query(`INSERT INTO notes (title, text, background)
                VALUES ($1, $2, $3) RETURNING *`, [title, text, background],
        async (error, results) => {
            if (error) throw error;
            for (let i = 0; i < groups.length; i++) {
                await setGroup(results.rows[0].id, groups[i])
            }
            response.status(200).send(`Ghost added with ID: ${results.rows.id}`);
        })
}

const setGroup = async (idNode, groupId) => {
    pool.query(`INSERT INTO groups_notes (note_id, group_id)
                VALUES ($1, $2)`, [idNode, groupId],
        error => {if (error) throw error})
}

const getGroupsFromArray = async (arr) => {
    const arrClone = [...arr];
    const resArr = [];

    for (let i = 0; i < arrClone.length; i++) {
        const res = await pool.query(
            `SELECT g.name, g.id
             FROM notes n
                      join groups_notes gn on gn.note_id = n.id
                      join groups g on gn.group_id = g.id
             where n.id = ${arrClone[i].id}`);
        if (res.rows) {
            resArr.push(res.rows);
        }
    }
    return resArr;
};
