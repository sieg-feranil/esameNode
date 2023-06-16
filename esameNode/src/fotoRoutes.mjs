import fs from 'fs/promises'
import fotos from "../db/foto.json" assert { type: "json" }
import deleted from "../db/deletedFoto.json" assert { type: "json" }
const DB_PATH_FOTO = './db/foto.json'
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
  .keys(fotos)
  .reduce((biggest, id) => biggest > parseInt(id, 10) ? biggest : parseInt(id, 10), 0)


export const getFoto = async (req, res) => {
  res.send(fotos[req.params.idf])
}

export const createFoto = async (req, res) => {
  NEXT++
  let newFoto = {
    [NEXT]: {
      ...req.body,
      "data_creazione": currTime
    }
  }
  let updatedFoto = {
    ...fotos,
    ...newFoto
  }

  await fs.writeFile(DB_PATH_FOTO, JSON.stringify(updatedFoto, null, '  '))
  res
    .status(201)
    .send({
      message: 'foto created'
    }).end()
}


export const updateFoto = async (req, res) => {
  let foto = fotos[req.params.idf]
  console.log(req.body)
  if (foto) {
    let addDate = {
      ...foto,
      "lastupdate": currTime
    }
    let newFoto = { ...addDate, ...req.body }
    fotos[req.params.idf] = newFoto
    await fs.writeFile(DB_PATH_FOTO, JSON.stringify(fotos, null, '  '))
    res.send(newFoto)
  } else {
    res
      .status(200)
      .send({
        data: {},
        error: true,
        message: 'foto not found'
      })
  }
}

export const deleteFoto = async (req, res) => {
  let foto = fotos[req.params.idf]
  if (foto) {
    let newDelete = {
      [req.params.idf]: {
        ...foto,
        "data_eliminazione": currTime
      }
    }
    let updatedDelete = {
      ...deleted,
      ...newDelete
    }
    await fs.writeFile(DB_PATH_DELETED_FOTO, JSON.stringify(updatedDelete, null, '  '))
    delete fotos[req.params.idf]
    await fs.writeFile(DB_PATH_FOTO, JSON.stringify(fotos, null, '  '))
    res.status(200).send('foto deleted').end()
  } else {
    res
      .status(200)
      .send({
        data: {},
        error: true,
        message: 'foto not found'
      })
  }

}