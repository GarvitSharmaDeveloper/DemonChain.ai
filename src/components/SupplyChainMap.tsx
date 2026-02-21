import React, { useEffect, useState } from 'react';
import { Factory, Ship, Store } from 'lucide-react';
import classNames from 'classnames';
import './SupplyChainMap.css';

interface SupplyChainMapProps {
    isCrisis: boolean;
}

const SupplyChainMap: React.FC<SupplyChainMapProps> = ({ isCrisis }) => {
    const [animateCrisis, setAnimateCrisis] = useState(false);

    useEffect(() => {
        if (isCrisis) {
            // Small delay to simulate agent connecting the dots
            const timer = setTimeout(() => {
                setAnimateCrisis(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setAnimateCrisis(false);
        }
    }, [isCrisis]);

    return (
        <div className="supply-chain-map">
            {/* SVG Background for lines */}
            <svg className="map-svg" viewBox="0 0 1000 400" preserveAspectRatio="none">
                {/* Taiwan to US Port */}
                <path
                    d="M 150 200 Q 325 100 500 200"
                    className={classNames('map-line', { crisis: animateCrisis })}
                />
                {/* US Port to NY */}
                <path
                    d="M 500 200 Q 675 300 850 200"
                    className={classNames('map-line', { crisis: animateCrisis })}
                />
            </svg>

            {/* Nodes Overlay */}
            <div
                className={classNames('map-node', { 'crisis alert-pulse': animateCrisis })}
                style={{ left: '15%', top: '50%' }}
            >
                <div className="node-icon-wrapper">
                    <Factory size={24} />
                </div>
                <div className="node-label">Taiwan Warehouse</div>
            </div>

            <div
                className={classNames('map-node', { 'crisis alert-pulse': animateCrisis })}
                style={{ left: '50%', top: '50%' }}
            >
                <div className="node-icon-wrapper">
                    <Ship size={24} />
                </div>
                <div className="node-label">US Port (Transit)</div>
            </div>

            <div
                className={classNames('map-node', { 'crisis alert-pulse': animateCrisis })}
                style={{ left: '85%', top: '50%' }}
            >
                <div className="node-icon-wrapper">
                    <Store size={24} />
                </div>
                <div className="node-label">NY Apple Store</div>
            </div>
        </div>
    );
};

export default SupplyChainMap;
