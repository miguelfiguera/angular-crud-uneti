const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { buildSpanishInsensitivePattern } = require('../utils/textSearch');
const { handleDbError } = require('../utils/handleDbError');

const ALLOWED_COLLECTIONS = ['peliculas', 'directores', 'generos', 'actores', 'resenas'];

function createCrudRouter() {
  const router = express.Router({ mergeParams: true });

  router.param('collection', (req, res, next, collection) => {
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return res.status(400).json({
        error: `Colección no permitida. Use: ${ALLOWED_COLLECTIONS.join(', ')}`,
      });
    }
    req.collectionName = collection;
    next();
  });

  // READ - Listar todos
  router.get('/:collection', async (req, res) => {
    try {
      const docs = await getDB()
        .collection(req.collectionName)
        .find({})
        .toArray();
      res.json(docs);
    } catch (error) {
      handleDbError(error, res);
    }
  });

  // READ - Consulta sencilla: películas por género
  router.get('/:collection/consulta/genero/:genero', async (req, res) => {
    if (req.collectionName !== 'peliculas') {
      return res.status(400).json({ error: 'Esta consulta solo aplica a la colección peliculas' });
    }
    try {
      const pattern = buildSpanishInsensitivePattern(req.params.genero);
      const docs = await getDB()
        .collection('peliculas')
        .find({ genero: { $regex: pattern, $options: 'i' } })
        .toArray();
      res.json({ genero: req.params.genero, total: docs.length, peliculas: docs });
    } catch (error) {
      handleDbError(error, res);
    }
  });

  // READ - Obtener por ID
  router.get('/:collection/:id', async (req, res) => {
    try {
      const doc = await getDB()
        .collection(req.collectionName)
        .findOne({ _id: new ObjectId(req.params.id) });
      if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });
      res.json(doc);
    } catch (error) {
      res.status(400).json({ error: 'ID inválido' });
    }
  });

  // CREATE
  router.post('/:collection', async (req, res) => {
    try {
      const result = await getDB()
        .collection(req.collectionName)
        .insertOne(req.body);
      const created = await getDB()
        .collection(req.collectionName)
        .findOne({ _id: result.insertedId });
      res.status(201).json(created);
    } catch (error) {
      handleDbError(error, res);
    }
  });

  // UPDATE
  router.put('/:collection/:id', async (req, res) => {
    try {
      const result = await getDB()
        .collection(req.collectionName)
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body },
          { returnDocument: 'after' }
        );
      if (!result) return res.status(404).json({ error: 'Documento no encontrado' });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'ID inválido o error en actualización' });
    }
  });

  // DELETE
  router.delete('/:collection/:id', async (req, res) => {
    try {
      const result = await getDB()
        .collection(req.collectionName)
        .deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Documento no encontrado' });
      }
      res.json({ message: 'Documento eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'ID inválido' });
    }
  });

  return router;
}

module.exports = { createCrudRouter, ALLOWED_COLLECTIONS };
