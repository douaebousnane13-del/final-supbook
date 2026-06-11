'use strict';

const { createCoreController } = require('@strapi/strapi').factories;


async function checkOwner(strapi, documentId, userId) {
    const livre = await strapi.documents('api::livre.livre').findOne({
     
      documentId,
     
     populate: ['users_permissions_user'],
  });
  if (!livre) return false;
  return livre.users_permissions_user?.id === userId;
}

module.exports = createCoreController('api::livre.livre', ({ strapi }) => ({

  
  async find(ctx) {
    
    const userId = ctx.state.user.id;
    
    const livres = await strapi.documents('api::livre.livre').findMany({
       filters: { users_permissions_user: { id: userId } },
      
       populate: ['auteur', 'collections'],
    });
    return { data: livres, meta: { pagination: { total: livres.length } } };
  },

  async create(ctx) {
    
    const result = await super.create(ctx);
    
    // on rattache l'user après la création parce que je trouvais pas
    // comment l'injecter avant via le ctx.request.body, c'est moche mais ça marche
    
    if (result?.data?.documentId) {
      
      await strapi.documents('api::livre.livre').update({
       
        documentId: result.data.documentId,
       
       
        data: { users_permissions_user: ctx.state.user.id },
      });
    }
   
    return result;
  },

  
  async update(ctx) {
   
    const ok = await checkOwner(strapi, ctx.params.id, ctx.state.user.id);
    if (!ok) return ctx.forbidden("Action non autorisée");
    
    return await super.update(ctx);
  },

  async delete(ctx) {
   
    const ok = await checkOwner(strapi, ctx.params.id, ctx.state.user.id);
   
    
    if (!ok) return ctx.forbidden("Action non autorisée");
    
    return await super.delete(ctx);
  },

}));
