import type { LngLat, LngLatBounds } from 'mapbox-gl';

import type { FilterSpecification, Level } from './types';

export const EarthRadius = 6371008.8;

export function overlap(bounds1: LngLatBounds, bounds2: LngLatBounds) {

    // If one rectangle is on left side of other
    if (bounds1.getWest() > bounds2.getEast() || bounds2.getWest() > bounds1.getEast()) {
        return false;
    }

    // If one rectangle is above other
    if (bounds1.getNorth() < bounds2.getSouth() || bounds2.getNorth() < bounds1.getSouth()) {
        return false;
    }

    return true;
}

export function filterWithLevel(initialFilter: FilterSpecification, level: Level): any {
    return [
        "all",
        [
            "has",
            "level"
        ],
        [
            "any",
            [
                "==",
                ["get", "level"],
                level.toString()
            ],
            [
                "all",
                [
                    "!=",
                    [
                        "index-of",
                        ";",
                        ["get", "level"]
                    ],
                    -1,
                ],
                [

                    ">=",
                    level,
                    [
                        "to-number",
                        [
                            "slice",
                            ["get", "level"],
                            0,
                            [
                                "index-of",
                                ";",
                                ["get", "level"]
                            ]
                        ]
                    ]
                ],
                [
                    "<=",
                    level,
                    [
                        "to-number",
                        [
                            "slice",
                            ["get", "level"],
                            [
                                "+",
                                [
                                    "index-of",
                                    ";",
                                    ["get", "level"]
                                ],
                                1
                            ]
                        ]
                    ]
                ]
            ]
        ],
        initialFilter
    ];
}


/**
 * Calculates the distance between two coordinates in meters.
 */
export function distance(from: LngLat, to: LngLat): number {
    var dLat = Math.PI / 180 * (to.lat - from.lat);
    var dLon = Math.PI / 180 * (to.lng - from.lng);
    var lat1 = Math.PI / 180 * (from.lat);
    var lat2 = Math.PI / 180 * (to.lng);
    var a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    return EarthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
