import request from 'axios';

async function getConfigs() {
  return await request.get('/api/config');
}

async function updateConfig(name, value) {
  return await request.put(`/api/config/${name}`, { value });
}

async function getGroups() {
  return await request.get('/api/groups');
}

async function createGroup(data) {
  return await request.post('/api/groups', { body: JSON.stringify(data) });
}

async function updateGroup(id, data) {
  return await request.put(`/api/groups/${id}`, { body: JSON.stringify(data) });
}

async function deleteGroup(id) {
  return await request.delete(`/api/groups/${id}`);
}
async function getApps() {
  return await request.get('api/apps');
}
async function createApp(data) {
  return await request.post('/api/apps', { body: JSON.stringify(data) });
}

async function updateApp(id, data) {
  return await request.put(`/api/apps/${id}`, { body: JSON.stringify(data) });
}

async function deleteApp(id) {
  return await request.delete(`/api/apps/${id}`);
}

async function createEngine(data) {
  return await request.post('/api/engines', { body: JSON.stringify(data) });
}

async function updateEngine(id, data) {
  return await request.put(`/api/engines/${id}`, { body: JSON.stringify(data) });
}

async function deleteEngine(id) {
  return await request.delete(`/api/engines/${id}`);
}

async function getImages() {
  return await request.get('/api/images');
}
async function uploadImage(formdata) {
  return await request.post('/api/images', { body: formdata });
}
async function deleteImage(id) {
  return await request.delete(`/api/images/${id}`);
}

const apis = {
  getApps,
  createApp,
  updateApp,
  deleteApp,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  createEngine,
  updateEngine,
  deleteEngine,
  getConfigs,
  updateConfig,
  getImages,
  uploadImage,
  deleteImage,
}
export default apis;