import express from "express"
import cors from "cors"
import * as album from './albumRoutes.mjs'
import * as foto from './fotoRoutes.mjs'
const app = express()
const port = 3000
import bodyParser from 'body-parser'
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


app.get('/', album.welcome)
app.get('/albums', album.allAlbums)
app.post('/albums', album.createAlbum)
app.get('/albums/:id', album.getAlbum)
app.put('/albums/:id', album.updateAlbum)
app.delete('/albums/:id', album.deleteAlbum)

app.post('/albums/:id/foto', foto.createFoto)
app.get('/albums/:id/foto/:idf', foto.getFoto)
app.put('/albums/:id/foto/:idf', foto.updateFoto)
app.delete('/albums/:id/foto/:idf', foto.deleteFoto)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})