import fs from 'fs/promises'
import albums from "../db/albums.json" assert { type: "json" }
import fotos from "../db/foto.json" assert { type: "json" }
import deletedF from "../db/deletedFoto.json" assert { type: "json" }
import deletedA from "../db/deletedAlbums.json" assert { type: "json" }
const DB_PATH_ALBUM = './db/albums.json'
const DB_PATH_FOTO = './db/foto.json'
const DB_PATH_DELETED_ALBUM = './db/deletedAlbums.json'
const DB_PATH_DELETED_FOTO = './db/deletedFoto.json'

function getDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return dateString;
}
let currTime = getDate()

export let NEXT = Object
    .keys(albums)
    .reduce((biggest, id) => biggest > parseInt(id, 10) ? biggest : parseInt(id, 10), 0)

export const welcome = async (req, res) => {
    res.send('Photoazon')
}

export const allAlbums = async (req, res) => {
    res.send(albums)
}

export const getAlbum = async (req, res) => {
    res.send(albums[req.params.id])
}

export const createAlbum = async (req, res) => {
    NEXT++
    let newAlbum = {
        [NEXT]: {
            ...req.body,
            "data_creazione": currTime
        }
    }
    let updatedAlbum = {
        ...albums,
        ...newAlbum
    }

    await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(updatedAlbum, null, '  '))
    res
        .status(201)
        .send({
            message: 'album created'
        }).end()
}


export const updateAlbum = async (req, res) => {
    let album = albums[req.params.id]
    console.log(req.body)
    if (album) {
        let addDate = {
            ...album,
            "lastupdate": currTime
        }
        let newalbum = { ...addDate, ...req.body }
        albums[req.params.id] = newalbum
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res.send(newalbum)
    } else {
        res
            .status(200)
            .send({
                data: {},
                error: true,
                message: 'album not found'
            })
    }
}


export const deleteAlbum = async (req, res) => {
    let album = albums[req.params.id]
    if (album) {
        let newDelete = {
            [req.params.id]: {
                ...album,
                "data_eliminazione": currTime
            }
        }
        let updatedDelete = {
            ...deletedA,
            ...newDelete
        }
        await fs.writeFile(DB_PATH_DELETED_ALBUM, JSON.stringify(updatedDelete, null, '  '))
        for (let i = 0; i < album.fotografie.length; i++) {
            console.log(fotos[album.fotografie[i]]);
            let newDelete = {
                [album.fotografie[i]]: {
                    ...fotos[album.fotografie[i]],
                    "data_eliminazione": currTime
                }
            }
            let updatedDelete = {
                ...deletedF,
                ...newDelete
            }
            await fs.writeFile(DB_PATH_DELETED_FOTO, JSON.stringify(updatedDelete, null, '  '))

            delete fotos[album.fotografie[i]]
            await fs.writeFile(DB_PATH_FOTO, JSON.stringify(fotos, null, '  '))
        }
        delete albums[req.params.id]
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res.status(200).send('album deleted').end()
    } else {
        res
            .status(200)
            .send({
                data: {},
                error: true,
                message: 'album not found'
            })
    }

}


