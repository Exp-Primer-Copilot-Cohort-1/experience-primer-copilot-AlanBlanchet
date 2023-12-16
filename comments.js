// Create web server
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var formidable = require('formidable');
var config = require('../config/config.js');
var pool = mysql.createPool(config);
var async = require('async');
var url = require('url');
var ejs = require('ejs');

// Create web server
router.get('/list', function(req, res, next) {
  // Get the query string
  var query = url.parse(req.url, true).query;
  var board_idx = query.board_idx;
  var page = query.page;
  var page_size = query.page_size;

  // Check the query string
  if (!board_idx || !page || !page_size) {
    res.status(400).json({
      result: false,
      message: 'Bad Request'
    });
    return;
  }

  // Get the total count of comments
  var sql_count = 'SELECT COUNT(*) AS count FROM comments WHERE board_idx=?';
  pool.query(sql_count, [board_idx], function(err, results) {
    if (err) {
      res.status(500).json({
        result: false,
        message: 'Internal Server Error'
      });
      return;
    }

    var count = results[0].count;
    var total_page = Math.ceil(count / page_size);

    // Get the comments
    var offset = (page - 1) * page_size;
    var sql = 'SELECT * FROM comments WHERE board_idx=? ORDER BY idx DESC LIMIT ?,?';
    pool.query(sql, [board_idx, offset, page_size], function(err, results) {
      if (err) {
        res.status(500).json({
          result: false,
          message: 'Internal Server Error'
        });
        return;
      }

      res.status(200).json({
        result: true,
        total_page: total_page,
        comments: results
      });
    });
  });
});

router.post('/write', function(req, res, next) {
  // Get the query string
  var query = url.parse(req.url, true).query;
  var board_idx = query.board_idx;

  // Check the query string
  if (!board_idx) {
    res.status(400).json({
      result: false,
      message: 'Bad Request'
    });
    return;}
})