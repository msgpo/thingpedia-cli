// -*- mode: js; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of Thingpedia
//
// Copyright 2019 The Board of Trustees of the Leland Stanford Junior University
//
// Author: Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See LICENSE for details
"use strict";

const fs = require('fs');
const Tp = require('thingpedia');

const StreamUtils = require('./lib/stream-utils');

module.exports = {
    initArgparse(subparsers) {
        const parser = subparsers.addParser('download-templates', {
            addHelp: true,
            description: "Download primitive templates from Thingpedia."
        });
        parser.addArgument(['-o', '--output'], {
            required: true,
            type: fs.createWriteStream
        });
    },

    async execute(args) {
        let url = args.thingpedia_url + '/api/v3/examples/all?locale=' + args.locale;
        if (args.developer_key)
            url += '&developer_key=' + args.developer_key;

        args.output.end(await Tp.Helpers.Http.get(url, { accept: 'application/x-thingtalk' }));
        await StreamUtils.waitFinish(args.output);
    }
};
