import React from 'react';
import './NewsArticle.css';
import type { NewsArticle as NewsArticleType } from '../data/mockNews';

interface NewsArticleProps {
    article: NewsArticleType;
}

const NewsArticle: React.FC<NewsArticleProps> = ({ article }) => {
    if (!article) return null;

    return (
        <div className="newspaper-container">
            {/* Header Area */}
            <header className="header">
                <h1 className="masthead">Logistics Daily News</h1>
                <div className="dateline">
                    <span>{new Date(article.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>Special Report</span>
                    <span>Final Edition</span>
                    <span>$2.50</span>
                </div>
            </header>

            {/* Main Single Article Spread */}
            <main className="single-article-spread">
                <h2 className="single-headline">{article.headline}</h2>

                <div className="article-meta">
                    <span className="byline">By {article.source}</span>
                    <span>—</span>
                    <span>{article.category}</span>
                    <span>—</span>
                    <span>{article.location_details.origin_city}, {article.location_details.origin_country}</span>
                </div>

                <div className="single-image-container">
                    <img src={article.imageUrl} alt={article.imageAlt} className="single-image" />
                    <p className="image-caption">{article.imageAlt} (Photo: Dispatch Archive)</p>
                </div>

                <div className="article-content">
                    <p id="raw-article-text-main">{article.raw_article_text}</p>
                </div>

                {/* Hidden metadata for AI Scraper */}
                <div className="scraper-data" data-event-id={article.id}>
                    <span data-origin={`${article.location_details.origin_city}, ${article.location_details.origin_country}`}></span>
                    <span data-impacted-routes={article.location_details.impacted_routes_to.join(';')}></span>
                </div>
            </main>
        </div>
    );
}

export default NewsArticle;
