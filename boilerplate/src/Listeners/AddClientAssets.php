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

namespace <%= namespace %>\Listeners;

use DirectoryIterator;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\ConfigureWebApp;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        <% if (admin || forum) { %>$events->listen(ConfigureWebApp::class, [$this, 'configureWebApp']);<% } %>
        <% if (useLocale) { %>$events->listen(ConfigureLocales::class, [$this, 'addLocales']);<% } %>
    }
    <% if (admin || forum) { %>
    /**
     * Modifies the client view for forum/admin.
     *
     * @param ConfigureWebApp $event
     */
    public function configureWebApp(ConfigureWebApp $event)
    {
        <% if (admin) { %>if ($event->isAdmin()) {
            $event->addAssets([
                <% if (useJs) { %>__DIR__.'/../../js/admin/dist/extension.js',<% } %>
                <% if (useCss) { %><%- resourcesFolder %>/less/admin.less',<% } %>
            ]);
            $event->addBootstrapper('<%= packageName %>/main');
        }<% } %>

        <% if (forum) { %>if ($event->isForum()) {
            $event->addAssets([
                <% if (useJs) { %>__DIR__.'/../../js/forum/dist/extension.js',<% } %>
                <% if (useCss) { %><%- resourcesFolder %>/less/app.less',<% } %>
            ]);
            $event->addBootstrapper('<%= packageName %>/main');
        }<% } %>
    }
    <% } %><% if (useLocale) { %>
    /**
     * Provides i18n files.
     *
     * @param ConfigureLocales $event
     */
    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(<%- resourcesFolder %>/locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }<% } %>
}
