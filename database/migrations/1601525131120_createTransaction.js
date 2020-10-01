module.exports = {
  'up': 'create transactions users(' +
    '  `id` bigint(20) NOT NULL AUTO_INCREMENT,\n' +
    '  `order_id` varchar(10) NOT NULL,\n' +
    '  `category_id` varchar (10) NOT NULL,\n' +
    '  `product_id` varchar (256) NOT NULL,\n' +
    '  `created_at` int(11) NOT NULL,\n' +
    '  `updated_at` int(11) NOT NULL,\n' +
    '  PRIMARY KEY (`id`),\n' +
    '  UNIQUE KEY `uk_1` (`username`)\n' +
    ')',
  'down': 'drop table if exists users;'
}