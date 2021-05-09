/* eslint-disable no-multi-spaces */
/* eslint-disable key-spacing */
const { Op, Sequelize } = require('sequelize');
// FUNCIONES AUXILIARES DE SEQUELIZE

/**
 * Busca la coincidencias dentro de un rango ve valores
 * @param {* min es de tipo integer y es el minimo valor de busqueda} min
 * @param {* max es de tipo integer y es el maximo valor de busqueda} max
 * @returns Un objeto de busqueda: [Op.gte]: (>=) o [Op.lte]: (<=)
 */
function buildMinMax(min, max) {
  // eslint-disable-next-line no-shadow
  const query = [];
  // { [Op.and]: [{},{},{}] }
  if (min) query.push({ [Sequelize.Op.gte]: min });
  if (max) query.push({ [Sequelize.Op.lte]: max });
  return { [Sequelize.Op.and]: query };
}

/**
   * Busca una las coincidencias (case insensitive) de una palabra (word) en un string
   * @param {* word es de tipo string} word
   * @returns Un objeto de busqueda: [Op.iLike]:
   */
function buildIlike(word) {
  return { [Op.iLike]: `%${word}%` };
}

/**
   * Busca el valor exacto
   * @param {* number es de tipo integer } number
   * @returns Un objeto de busqueda: [Op.eq]:
   */
function buildEqual(number) {
  return { [Op.eq]: number };
}

/**
   * Construye una sentencia where en conjunto con varios and
   * @param {* block es un objeto con los atributos que se van a usar para los filtro } block
   * @returns Las condiciones de busqueda: where atributo1 and atributo2 and ...
   */
function buidlWhere(block) {
  // eslint-disable-next-line no-shadow
  const query = [];

  query.push({ price: buildMinMax(block.priceMin, block.priceMax) });
  query.push({ m2:    buildMinMax(block.areaMin, block.areaMax) });
  if (block.city)         query.push({ city:         buildIlike(block.city) });
  if (block.neighborhood) query.push({ neighborhood: buildIlike(block.neighborhood) });
  if (block.prop_type)    query.push({ prop_type:    buildIlike(block.prop_type) });
  if (block.stratum)      query.push({ stratum:      buildEqual(block.stratum) });
  if (block.rooms)        query.push({ rooms:        buildEqual(block.rooms) });
  if (block.bathrooms)    query.push({ bathrooms:    buildEqual(block.bathrooms) });
  if (block.years)        query.push({ years:        buildEqual(block.years) });

  return { [Sequelize.Op.and]: query };
}

// FUNCIONES AUXILIARES PARA EL PAGINADO
/**
 * Obtiene el numero de la pagina actual con respecto al offset y al limit
 * @param {* offset es de tipo integer y es desde donde empiezo a traer los datos} offset
 * @param {* limit es de tipo integer y es la cantidad de registros que devuelvo} limit
 * @returns Un integer
 */
function getCurrentPage(offset, limit) {
  return (offset + limit) / limit;
}

/**
 * Reconstruye el Enpoint utilizado desde el front
 * @param {* block es un objeto con los atributos que se usaron para los filtro} block
 * @param {* offset es de tipo integer y es desde donde empiezo a traer los datos} offset
 * @returns Un string (endpoint) con todas las re.query que se usaron
 */
function getCurrentEndPoint(block, limit, offset) {
  let endpoint = `http://localhost:3001/posts?offset=${offset}`;

  if (block.city)         endpoint += `&city=${block.city}`;
  if (block.neighborhood) endpoint += `&neighborhood=${block.neighborhood}`;
  if (block.prop_type)    endpoint += `&prop_type=${block.prop_type}`;
  if (block.stratum)      endpoint += `&stratum=${block.stratum}`;
  if (block.rooms)        endpoint += `&rooms=${block.rooms}`;
  if (block.bathrooms)    endpoint += `&bathrooms=${block.bathrooms}`;
  if (block.years)        endpoint += `&years=${block.years}`;
  if (block.priceMin)     endpoint += `&priceMin=${block.priceMin}`;
  if (block.priceMax)     endpoint += `&priceMax=${block.priceMax}`;
  if (block.areaMin)      endpoint += `&areaMin=${block.areaMin}`;
  if (block.areaMax)      endpoint += `&areaMax=${block.areaMax}`;
  if (limit) endpoint += `&limit=${limit}`;

  return endpoint;
}

module.exports = {
  buidlWhere,
  buildEqual,
  buildIlike,
  buildMinMax,
  getCurrentPage,
  getCurrentEndPoint,
};
