'use strict';

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/absainte';

var client = new pg.Client(connectionString);
client.connect();

var activateUuidExtension = function() {
    var query = client.query('CREATE EXTENSION "uuid-ossp";');
    query.on('end', function () {
        client.end();
    });
};

var createDB = function () {
    console.log('entering');

    var query = client.query('' +
        'CREATE TABLE IF NOT EXISTS images(' +
            'id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), ' +
            'type VARCHAR(20) not null, ' +
            'name VARCHAR(100) not null,' +
            'permalink VARCHAR(100) not null,' +
            'imageUrl VARCHAR(200),' +
            'thumbnailImgUrl VARCHAR(200),' +
            'listImgUrl VARCHAR(200),' +
            'largeImgUrl VARCHAR(200)' +
        ');' +
        'CREATE TABLE IF NOT EXISTS collections(' +
                'id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), ' +
                'type VARCHAR(20) not null, ' +
                'name VARCHAR(100) not null,' +
                'permalink VARCHAR(100) not null,' +
                'main_image UUID REFERENCES images (id),' +
                'description_fr TEXT,' +
                'description_en TEXT' +
        ');' +
        'CREATE TABLE IF NOT EXISTS products(' +
            'id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), ' +
            'collection UUID REFERENCES collections (id), ' +
            'name VARCHAR(100) not null,' +
            'permalink VARCHAR(100) not null,' +
            'main_image UUID REFERENCES images (id),' +
            'description_fr TEXT,' +
            'description_en TEXT' +
        ');' +
        'CREATE TABLE IF NOT EXISTS additional_images(' +
            'image UUID REFERENCES images (id), ' +
            'product UUID REFERENCES products (id) ' +
        ');'
    );
    query.on('end', function () {
        client.end();
    });
};

createDB();

