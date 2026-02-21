export interface NewsArticle {
    id: string;
    location: string; // Internal dropdown mapping
    headline: string;
    source: string;
    timestamp: string;
    category: string;
    location_details: {
        origin_city: string;
        origin_country: string;
        impacted_routes_to: string[];
    };
    raw_article_text: string;
    imageUrl: string;
    imageAlt: string;
    parsedData: {
        eventType: string;
        impactAssessment: string;
        computedSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
        predictedDelayDays: number;
    }
}

export const mockNewsData: Record<string, NewsArticle> = {
    'Taiwan Warehouse': {
        id: 'EVT-2026-8891-TW',
        location: 'Taiwan Warehouse',
        headline: 'Super Typhoon Shuts Down Hsinchu Science Park',
        source: 'Logistics Daily News',
        timestamp: '2026-02-20T08:15:00Z',
        category: 'World',
        location_details: {
            origin_city: 'Hsinchu',
            origin_country: 'Taiwan',
            impacted_routes_to: ['New York, USA', 'San Francisco, USA']
        },
        raw_article_text: 'A catastrophic Category 5 Super Typhoon has made direct landfall on Taiwan\'s western coast. Wind speeds exceeding 160 mph and severe flooding have forced the emergency shutdown of all major semiconductor fabrication plants in the Hsinchu Science Park. Port authorities in Kaohsiung have also halted all outbound cargo ships. Industry experts expect complete production halts for at least 7 days, causing massive downstream bottlenecks for consumer electronics heading to North America.',
        imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1200&auto=format&fit=crop',
        imageAlt: 'Typhoon waves crashing against a seawall',
        parsedData: {
            eventType: 'Natural Disaster - Super Typhoon',
            impactAssessment: 'Emergency shutdown of semiconductor plants. Port outbound cargo halted. Downstream bottlenecks expected.',
            computedSeverity: 'Critical',
            predictedDelayDays: 7
        }
    },
    'India Port': {
        id: 'EVT-2026-4420-IN',
        location: 'India Port',
        headline: 'Monsoon Flooding Blocks Major Highways Out of Mumbai',
        source: 'Logistics Daily News',
        timestamp: '2026-02-20T10:30:00Z',
        category: 'Weather',
        location_details: {
            origin_city: 'Mumbai',
            origin_country: 'India',
            impacted_routes_to: ['London, UK', 'Rotterdam, Netherlands']
        },
        raw_article_text: 'Unexpectedly heavy monsoon rains have caused severe flash flooding across the greater Mumbai industrial corridor. While the main automotive manufacturing plants remain operational on backup power, the primary multi-lane highways connecting the factories to the Nhava Sheva shipping port are currently submerged and impassable. Heavy duty transport trucks are unable to leave the facilities. Local authorities estimate roadways will take 3 to 4 days to clear and inspect before heavy freight transit can resume.',
        imageUrl: 'https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=800&auto=format&fit=crop',
        imageAlt: 'Flooded city streets during a storm',
        parsedData: {
            eventType: 'Weather - Monsoon Flooding',
            impactAssessment: 'Highways to Nhava Sheva port submerged. Freight transit halted. Facilities running on backup power.',
            computedSeverity: 'Medium',
            predictedDelayDays: 4
        }
    },
    'Singapore Hub': {
        id: 'EVT-2026-1105-SG',
        location: 'Singapore Hub',
        headline: 'IT Glitch Causes Temporary Delays at Port of Singapore',
        source: 'Logistics Daily News',
        timestamp: '2026-02-20T14:05:00Z',
        category: 'Technology',
        location_details: {
            origin_city: 'Singapore',
            origin_country: 'Singapore',
            impacted_routes_to: ['Sydney, Australia']
        },
        raw_article_text: 'The Maritime and Port Authority of Singapore reported a brief software malfunction within their automated container weighing and tracking system early this morning. A routine database migration caused the automated crane assignments to stall for approximately 6 hours. IT teams have successfully rolled back the update and systems are slowly coming back online. Port officials have stated there is a backlog of out-bound freighters, but they expect to clear the queue within 12 to 24 hours. No structural damage or lost cargo has been reported.',
        imageUrl: 'https://images.unsplash.com/photo-1586345542291-e2fa6e4a0f65?q=80&w=1200&auto=format&fit=crop',
        imageAlt: 'Aerial view of Singapore shipping port',
        parsedData: {
            eventType: 'Technology - IT Malfunction',
            impactAssessment: 'Automated crane assignments stalled for 6 hours. Backlog of outbound freighters to clear in 24 hours.',
            computedSeverity: 'Low',
            predictedDelayDays: 1
        }
    }
};
