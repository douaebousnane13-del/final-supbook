 'use strict';

  

const CONTENT_TYPES =  {
  
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
    
        if (roleAuth == null) {
  return;
}
       console.log('role found:', roleAuth.id);

    for (const [contentType, actions] of Object.entries(CONTENT_TYPES)) {
      for (const action of actions) {

    const actionKey = `${contentType}.${action}`;

      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
  where: { action: actionKey, role: roleAuth.id },

        });
        
       
       
      if (existing && !existing.enabled) {
  await strapi.db.query('plugin::users-permissions.permission').update({
      where: { id: existing.id },
   data: { enabled: true },
  });

} else if (!existing) {

  await strapi.db.query('plugin::users-permissions.permission').create({

    data: { action: actionKey, role: roleAuth.id, enabled: true },
  });
}
      }
    }
  },
};