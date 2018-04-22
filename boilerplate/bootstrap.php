<?php

/**
 *  This file is part of <%= packageName %>.
 *
 *  Copyright (c) 2018 <% authorName %>.
 *
 *
 *  For the full copyright and license information, please view the LICENSE.md
 *  file that was distributed with this source code.
 */

namespace <%= namespace %>;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    <% if (admin && forum && useLocale) { %>$events->subscribe(Listeners\AddClientAssets::class);<% } %>
};
