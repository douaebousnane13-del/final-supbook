'use strict';

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::collection.collection', ({ strapi }) => ({

  async find(ctx) {
    
   const collections = await strapi.documents('api::collection.collection').findMany({
       filters: { users_permissions_user: { id: ctx.state.user.id } },
    });
   
    return { data: collections, meta: { pagination: { total: collections.length } } };
  },

  async create(ctx) {
   
    const result = await super.create(ctx);
    
       if (result?.data?.documentId) {
     
     await strapi.documents('api::collection.collection').update({
         documentId: result.data.documentId,
       data: { users_permissions_user: ctx.state.user.id },
      });
    }
    return result;
  },

  
  async delete(ctx) {
      const userId = ctx.state.user.id;
    const collection = await strapi.documents('api::collection.collection').findOne({
          documentId: ctx.params.id,
      populate: ['users_permissions_user'],
    });

      if (!collection) return ctx.notFound();
      if (collection.users_permissions_user?.id !== userId) {
        return ctx.forbidden("pas autorisé");
    }

    return await super.delete(ctx);
  },

  async update(ctx) {
    const userId = ctx.state.user.id;
    const collection = await strapi.documents('api::collection.collection').findOne({
         documentId: ctx.params.id,
     populate: ['users_permissions_user'],
    });

     if (!collection) return ctx.notFound();
     if (collection.users_permissions_user?.id !== userId) {
       return ctx.forbidden("pas autorisé");
    }

       return await super.update(ctx);
  },

}));