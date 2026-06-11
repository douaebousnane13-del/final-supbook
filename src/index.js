'use strict';

  

const ACTIONS_PAR_CONTENT_TYPE = {
  'api::livre.livre': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::auteur.auteur': ['find', 'findOne', 'create', 'update', 'delete'],
'api::collection.collection': ['find', 'findOne', 'create', 'update', 'delete'],
};

module.exports = {
  register() {},

    async bootstrap({ strapi }) {
 const roleAuth = await strapi.db.query('plugin::users-permissions.role').findOne({
          where: { type: 'authenticated' },
    });
        if (!roleAuth) return;

    for (const [contentType, actions] of Object.entries(ACTIONS_PAR_CONTENT_TYPE)) {
     for (const action of actions) {
    const actionKey = `${contentType}.${action}`;
   const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
  where: { action: actionKey, role: roleAuth.id },
        });
        
       
       
        if (!existing) {
           await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action: actionKey, role: roleAuth.id, enabled: true },
          });

        } else if (!existing.enabled) {
          
      await strapi.db.query('plugin::users-permissions.permission').update({
                where: { id: existing.id },
            data: { enabled: true },
          });
        }
      }
    }
  },
};
