const { Events } = require('discord.js');
const db = require('../database');
const models = require('../database/models');


module.exports = { 
    name: Events.ClientReady, 
    once: true,
    execute (client) {
        
        try {
            console.info('[POSTGRES] Установка соединения...')

            Object.keys(models).forEach(ele => {
                models[ele].associate(models);
            })
            
            db.sync({force: false})
        } catch (error) {
            console.error('[POSTGRES] Ошибка синхроницазии!', error)
        } finally {
            console.info('[POSTGRES] Синхронизация закончена.')
        }
         
        console.log(`[${client.user.displayName.toUpperCase()}] ${client.user.tag} Готов!`);
    },
};