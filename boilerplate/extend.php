<?php

/*
 * This file is part of <%= packageName %>.
 *
 * Copyright (c) 2018 <% authorName %>.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace <%= namespace %>;

use Flarum\Extend;

return [
    <% if (forum) { %>(new Extend\Frontend('forum'))
        <% if (useJs) { %>->js(__DIR__.'/js/dist/forum.js')<% if (!useCss) { %>,<% } %><% } %>
        <% if (useCss) { %>->css(__DIR__.'<%- resourcesFolder %>/less/forum.less'),<% } %><% } %>
    <% if (admin) { %>(new Extend\Frontend('admin'))
        <% if (useJs) { %>->js(__DIR__.'/js/dist/admin.js')<% if (!useCss) { %>,<% } %><% } %>
        <% if (useCss) { %>->css(__DIR__.'<%- resourcesFolder %>/less/admin.less'),<% } %><% } %>
    <% if (useLocale) { %>new Extend\Locales(__DIR__ . '<%- resourcesFolder %>/locale')<% } %>
];
