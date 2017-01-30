(function() {
  var services;

  services = angular.module('tweetApp.services', []);

  services.factory('Post', function($log) {
    var Post;
    Post = (function() {
      function Post(data) {
        if (data !== null) {
          this.init(data);
        }
      }

      Post.prototype.init = function(data) {
        this.id = data.id;
        this.name = data.display_name;
        this.user_name = data.user_name;
        this.known_user = data.known_user;
        this.content = data.content;
        if (data.has_location) {
          this.lat = data.lat;
          this.lon = data.lon;
        }
        this.thumbnail = data.thumbnail_link;
        this.image = data.image_link;
        this.profile_pic = data.profile_pic;
        this.content_date = data.content_date;
        this.source = data.source_type;
        this["new"] = false;
        return this.color = "#39cccc";
      };

      return Post;

    })();
    return Post;
  });

    services.factory('Hashtag', function($log) {
        var Hashtag;
        Hashtag = (function() {
        function Hashtag(data) {
            if (data !== null) {
                this.init(data);
            }
        }

        Hashtag.prototype.init = function(data) {
            this.hashtag = data.hashtag;
            this.verified = data.verified_count;
            return this.unverified = data.unverified_count;
        };

        return Hashtag;

    })();
        return Hashtag;
    });


    services.factory('Posts', function($log, $http, Post) {
        var posts;
        posts = {
      all: [],
      verified: [],
      unverified: [],
      tweets: [],
      instas: [],
      location: []
    };
    return {
      postsReset: function(callback) {
        posts = {
          all: [],
          verified: [],
          unverified: [],
          tweets: [],
          instas: [],
          location: []
        };
        return callback();
      },
      checkExists: function(post, type) {
        var old_post, postExists, _i, _len, _ref;
        postExists = false;
        _ref = posts[type];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          old_post = _ref[_i];
          if (old_post.id === post.id) {
            postExists = true;
          }
        }
        return postExists;
      },
      fromServer: function(data, callback) {
        return this.postsReset(function() {
          var new_post, post, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            post = data[_i];
            new_post = new Post(post);
            posts['all'].push(new_post);
            if (new_post.source === 'TW') {
              posts['tweets'].push(new_post);
            }
            if (new_post.source === 'IN') {
              posts['instas'].push(new_post);
            }
            if (new_post.known_user) {
              posts['verified'].push(new_post);
              if (new_post.lat && new_post.lon) {
                posts['location'].push(new_post);
              }
            } else {
              posts['unverified'].push(new_post);
            }
          }
          return callback(posts);
        });
      },
      clearNew: function() {
        var post, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
        _ref = posts['all'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          post = _ref[_i];
          post["new"] = false;
          post.color = "#39cccc";
        }
        _ref1 = posts['verified'];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          post = _ref1[_j];
          post["new"] = false;
          post.color = "#39cccc";
        }
        _ref2 = posts['unverified'];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          post = _ref2[_k];
          post["new"] = false;
          post.color = "#39cccc";
        }
        _ref3 = posts['tweets'];
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          post = _ref3[_l];
          post["new"] = false;
          post.color = "#39cccc";
        }
        _ref4 = posts['instas'];
        for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
          post = _ref4[_m];
          post["new"] = false;
          post.color = "#39cccc";
        }
        _ref5 = posts['location'];
        _results = [];
        for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
          post = _ref5[_n];
          post["new"] = false;
          _results.push(post.color = "#39cccc");
        }
        return _results;
      },
      processRecent: function(data, callback) {
        var new_post, post, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          post = data[_i];
          new_post = new Post(post);
          new_post["new"] = true;
          new_post.color = "#cc3939";
          if (!this.checkExists(new_post, 'all')) {
            posts['all'].push(new_post);
            if (new_post.source === 'TW') {
              posts['tweets'].push(new_post);
            }
            if (new_post.source === 'IN') {
              posts['instas'].push(new_post);
            }
            if (new_post.known_user) {
              posts['verified'].push(new_post);
              if (new_post.lat && new_post.lon) {
                if (!this.checkExists(new_post, 'location')) {
                  posts['location'].push(new_post);
                }
              }
            } else {
              posts['unverified'].push(new_post);
            }
          }
        }
        return callback(angular.copy(posts));
      },
      processLocation: function(data, callback) {
        var new_post, post, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          post = data[_i];
          new_post = new Post(post);
          new_post["new"] = true;
          new_post.color = "#cc3939";
          if (!this.checkExists(new_post, 'location')) {
            posts['location'].push(new_post);
          }
        }
        return callback(posts['location']);
      },
      getAll: function(callback) {
        var _this = this;
        return $http({
          method: 'GET',
          url: '/polls/posts'
        }).success(function(data) {
          $log.info("Succesfully fetched posts.");
          return _this.fromServer(data.reverse(), callback);
        }).error(function(data) {
          return $log.info("Failed to fetch posts.");
        });
      },
      getRecent: function(callback) {
        var _this = this;
        this.clearNew();
        return $http({
          method: 'GET',
          url: '/polls/posts/recent'
        }).success(function(data) {
          $log.info("Succesfully fetched recent posts.");
          return _this.processRecent(data.reverse(), callback);
        }).error(function(data) {
          return $log.info("Failed to fetch posts.");
        });
      },
      getLocation: function(callback) {
        var _this = this;
        this.clearNew();
        return $http({
          method: 'GET',
          url: '/polls/posts/location'
        }).success(function(data) {
          $log.info("Succesfully fetched location posts.");
          return _this.processLocation(data, callback);
        }).error(function(data) {
          return $log.info("Failed to fetch posts.");
        });
      },
      data: function() {
        return posts;
      },
      all: function() {
        return posts.all;
      },
      tweets: function() {
        return posts.tweets;
      },
      instas: function() {
        return posts.instas;
      },
      location: function() {
        return posts.location;
      },
      verified: function() {
        return posts.verified;
      },
      unverified: function() {
        return posts.unverified;
      }
    };
  });


  services.factory('HashtagStats', function($log, $http, Hashtag) {
    var hashtags;
    hashtags = {
      all: [],
      verified: 0,
      unverified: 0,
      total: 0
    };
    return {
      hashtagsReset: function(callback) {
        hashtags = {
          all: [],
          verified: 0,
          unverified: 0,
          total: 0
        };
        return callback();
      },
      fromServer: function(data, callback) {
        return this.hashtagsReset(function() {
          var hashtag, new_hashtag, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            hashtag = data[_i];
            new_hashtag = new Hashtag(hashtag);
            hashtags['all'].push(new_hashtag);
            hashtags['verified'] += new_hashtag.verified;
            hashtags['unverified'] += new_hashtag.unverified;
            hashtags['total'] += new_hashtag.verified + new_hashtag.unverified;
          }
          return callback();
        });
      },
      fetch: function(callback) {
        var _this = this;
        return $http({
          method: 'GET',
          url: '/polls/hashtag/stats'
        }).success(function(data) {
          $log.info("Succesfully fetched hashtags.");
          return _this.fromServer(data, callback);
        }).error(function(data) {
          return $log.info("Failed to fetch hashtags.");
        });
      },
      data: function() {
        return hashtags;
      },
      all: function() {
        return hashtags.all;
      },
      verified: function() {
        return hashtags.verified;
      },
      unverified: function() {
        return hashtags.unverified;
      },
      counts: function() {
        return {
          verified: hashtags.verified,
          unverified: hashtags.unverified,
          total: hashtags.total
        };
      }
    };
  });

}).call(this);