if (typeof wp === 'undefined' || typeof wp.hooks === 'undefined') {
      // wpが存在しない場合は何もしない
      console.log('disable-spacer-block: wp not available');
  } else {
      wp.hooks.addFilter(
          'blocks.registerBlockType',
          'liteword/disable-spacer-inserter',
          function(settings, name) {
              if (name === 'core/spacer') {
                  return {
                      ...settings,
                      supports: {
                          ...settings.supports,
                          inserter: false
                      }
                  };
              }
              return settings;
          }
      );
  }