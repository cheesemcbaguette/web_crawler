import { test, expect } from "@jest/globals";

import { normalizeURL, getURLsFromHTML  } from "./crawl.js";

test('normalizes URLs with different schemes', () => {
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
    expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('normalizes URLs with and without trailing slashes', () => {
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
    expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizes URLs with query parameters and fragments', () => {
    expect(normalizeURL('https://blog.boot.dev/path/?query=1')).toBe('blog.boot.dev/path');
    expect(normalizeURL('https://blog.boot.dev/path/#fragment')).toBe('blog.boot.dev/path');
});

test('normalizes URLs with different subdomains', () => {
    expect(normalizeURL('https://sub.blog.boot.dev/path/')).toBe('sub.blog.boot.dev/path');
});

test('normalizes URLs with different cases', () => {
    expect(normalizeURL('https://BLOG.BOOT.DEV/PATH/')).toBe('blog.boot.dev/PATH');
});

test('handles invalid URLs', () => {
    expect(normalizeURL('invalid-url')).toBeNull();
    expect(normalizeURL('')).toBeNull();
    expect(normalizeURL(null)).toBeNull();
});

test('converts relative URLs to absolute URLs', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="/path/">Relative Link</a>
            </body>
        </html>
    `;
    const baseURL = 'https://example.com';
    const urls = getURLsFromHTML(htmlBody, baseURL);
    expect(urls).toEqual(['https://example.com/path/']);
});

test('finds all anchor elements in HTML', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="https://example.com/path1/">Link 1</a>
                <a href="https://example.com/path2/">Link 2</a>
                <a href="https://example.com/path3/">Link 3</a>
            </body>
        </html>
    `;
    const baseURL = 'https://example.com';
    const urls = getURLsFromHTML(htmlBody, baseURL);
    expect(urls).toEqual([
        'https://example.com/path1/',
        'https://example.com/path2/',
        'https://example.com/path3/'
    ]);
});

test('handles a mix of relative and absolute URLs', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="/relative/path/">Relative Link</a>
                <a href="https://example.com/absolute/path/">Absolute Link</a>
            </body>
        </html>
    `;
    const baseURL = 'https://example.com';
    const urls = getURLsFromHTML(htmlBody, baseURL);
    expect(urls).toEqual([
        'https://example.com/relative/path/',
        'https://example.com/absolute/path/'
    ]);
});

test('returns an empty array when no anchor elements are present', () => {
    const htmlBody = `
        <html>
            <body>
                <p>No links here!</p>
            </body>
        </html>
    `;
    const baseURL = 'https://example.com';
    const urls = getURLsFromHTML(htmlBody, baseURL);
    expect(urls).toEqual([]);
});