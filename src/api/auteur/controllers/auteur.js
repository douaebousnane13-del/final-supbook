'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::auteur.auteur', ({ strapi }) => ({

  
  async find(ctx) {
  const auteurs = await strapi.documents('api::auteur.auteur').findMany({
       filters: { users_permissions_user: { id: ctx.state.user.id } },
    });
      return { data: auteurs, meta: { pagination: { total: auteurs.length } } };
  },

  async create(ctx) {
      const result = await super.create(ctx);
    if (result?.data?.documentId) {
    await strapi.documents('api::auteur.auteur').update({
         documentId: result.data.documentId,
           data: { users_permissions_user: ctx.state.user.id },
      });
    }
    return result;
  },

async delete(ctx) {
const userId = ctx.state.user.id;
const auteur = await strapi.documents('api::auteur.auteur').findOne({
       documentId: ctx.params.id,
       populate: ['users_permissions_user'],
    });


    if (!auteur) return ctx.notFound();
    if (auteur.users_permissions_user?.id !== userId) {
      return ctx.forbidden("Tu peux pas supprimer l'auteur de quelqu'un d'autre");
    }


      // si on supprime diret ca casse les relations sur les livres
    // donc on remet auteur à null avant
      
  const livresLies = await strapi.documents('api::livre.livre').findMany({
  filters: { auteur: { documentId: auteur.documentId } },
});

for (const livre of livresLies) {
  await strapi.documents('api::livre.livre').update({
    documentId: livre.documentId,
    data: { auteur: null },
  });
}

    return await super.delete(ctx);
  },

}));
