const { nanoid } = require('nanoid');
const notes = require('./notes');

// Tambah catatan
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id, title, tags, body, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.find(note => note.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: { noteId: id },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Ambil semua catatan
const getAllNotesHandler = () => ({
  status: 'success',
  data: { notes },
});

// Ambil satu catatan
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.find(n => n.id === id);

  if (note) {
    return {
      status: 'success',
      data: { note },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Edit catatan
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex(n => n.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Hapus catatan
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex(n => n.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
