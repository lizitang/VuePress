## DummyCache/MemCache
在修改PHP项目的时候，已配置完本地环境(php->local->base.php)，启动本地项目同时修改本地某个PHP文件内容，刷新浏览器该页面内容并未有任何变化。

[Yii2.0参考文档](https://www.yiichina.com/doc/api/2.0/yii-caching-memcache)

::: tip
当缓存方式为Memcache时，应该是去缓存中调取的数据，所以修改本地文件没有效果。DummyCache仅为一个缓存占位符，不实现任何真正的缓存功能
:::
```php
  'cache' => [
            'class' => 'yii\caching\DummyCache',
            // 'class' => 'yii\caching\Memcache',
            // 'servers' => [
            //     [
            //       'host' => '10.x.xx.xxx',
            //       'port' => '11235',
            //       'weight' => 60,
            //     ]
            // ],
            //  'servers' => [
            //   [
            //     'host' => '1xx.x.x.x',
            //     'port' => '12000',
            //     'weight' => 60,
            //  ]
        //  ],
        ],
```
### 支持的缓存方式
数据缓存需要缓存组件提供支持，它代表各种缓存存储器， 例如内存，文件，数据库
```php
'components' => [
  'cache' => [
      'class' => 'yii\caching\FileCache',
      // 上面这种是Yii默认的缓存方式，标准文件缓存数据，当然也可以使用其他方式，如：
      // 'class' => 'yii\caching\MemCache',
      // 'class' => 'yii\caching\ApcCache',
  ],
]
```
`yii\caching\DummyCache`：仅作为一个缓存占位符，不实现任何真正的缓存功能。 这个组件的目的是为了简化那些需要查询缓存有效性的代码。
例如，在开发中如果服务器没有实际的缓存支持，用它配置 一个缓存组件。一个真正的缓存服务启用后，可以再切换为使用相应的缓存组件。

`yii\caching\MemCache`：使用 PHP memcache 和 memcached 扩展。 这个选项被看作分布式应用环境中（例如：多台服务器， 有负载均衡等）最快的缓存方案。
