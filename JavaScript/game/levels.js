/**
 * Level definitions for the Brick Breaker 3D game
 */

// Define levels with different brick layouts and configurations
export const levels = [
    {
        name: "Iniciante",
        description: "Comece sua jornada com tijolos básicos - aprenda os controles!",
        brickRows: 2,
        brickCols: 5,
        brickTypes: ['normal'],
        pattern: 'simple',
        brickLayout: {
            normal: 'fill' // simple fill pattern for beginners
        },
        paddleSpeed: 0.3,
        ballSpeed: 0.3,
        backgroundColor: 0x001122,
        powerupChance: 0.4
    },    {
        name: "Fortaleza Resistente",
        description: "Tijolos mais duros requerem estratégia",
        brickRows: 4,
        brickCols: 8,
        brickTypes: ['normal', 'strong'],
        pattern: 'fortress',        brickLayout: {
            strong: [
                [2,3,4,5],           // top row: central fortress wall
                [1,2,5,6],           // second row: fortress extensions
                [0,1,6,7],           // third row: fortress outer walls
                [2,3,4,5]            // bottom row: fortress base
            ],
            normal: 'fill'           // fill remaining spaces with normal bricks
        },
        paddleSpeed: 0.4,
        ballSpeed: 0.3,
        backgroundColor: 0x002233,
        powerupChance: 0.25
    },    {
        name: "Reação em Cadeia",
        description: "Use explosões estrategicamente",
        brickRows: 6,
        brickCols: 10,
        brickTypes: ['normal', 'explosive'],
        pattern: 'strategic',
        brickLayout: {
            explosive: {
                // Row 0: Two separate clusters at top - left and right sides
                0: [1,2,7,8],
                // Row 1: Extend both top clusters vertically
                1: [1,2,8],
                // Row 2: Mid-level clusters - far left and center
                2: [0,4,5],
                // Row 3: Single strategic bricks for chain bridging
                3: [4,8],
                // Row 4: Bottom clusters - left continuation and right cluster
                4: [0,7,8,9],
                // Row 5: Final center cluster for maximum chain potential
                5: [4,5]
            },
            normal: 'fill'           // fill remaining spaces with normal bricks
        },
        paddleSpeed: 0.45,
        ballSpeed: 0.3,
        backgroundColor: 0x220011,
        powerupChance: 0.2,
        specialFeatures: {
            chainReaction: true,
            explosionRadius: 2
        }
    },    {
        name: "Parede Móvel",
        description: "Cuidado! Os tijolos se movem!",
        brickRows: 4,
        brickCols: 8,
        brickTypes: ['moving', 'metal', 'strong', 'normal'],
        pattern: 'moving',        brickLayout: {
            moving: [[1,6], [1,6]],
            normal: 'fill'
        },
        paddleSpeed: 0.5,
        ballSpeed: 0.3,
        backgroundColor: 0x113322,
        powerupChance: 0.15,
        specialFeatures: {
            movingBricks: true,
            movePattern: 'horizontal',
            moveSpeed: 1.6
        }    },
    {
        name: "Boss Battle",
        description: "Defeat the Core Guardian! Hit the glowing weak spot to deal damage.",
        backgroundColor: 0x000510,
        brickRows: 1,
        brickCols: 1,
        brickTypes: ['boss'],
        paddleSpeed: 0.6,
        ballSpeed: 0.3, 
        powerupChance: 0,
        brickLayout: {
            'boss': [[1]] // Single boss brick in the center
        }
    }
];

// Brick type definitions
export const brickTypes = {
    normal: {
        health: 1,
        points: 100,
        material: 'standard',
        color: 0xff7700
    },
    strong: {
        health: 2,
        points: 200,
        material: 'phong',
        color: 0x00aa44
    },
    metal: {
        health: 3,
        points: 300,
        material: 'physical',
        color: 0xaaaaaa
    },
    explosive: {
        health: 1,
        points: 150,
        material: 'standard',
        color: 0xff3333,
        onDestroy: 'explode'
    },
    trigger: {
        health: 1,
        points: 250,
        material: 'standard',
        color: 0xffff00,
        onDestroy: 'triggerEffect'
    },
    boss: {
        color: 0x880088,
        health: 5,
        points: 1000,
        size: 4,
        onUpdate: 'boss',
        onHit: 'boss'
    },
    moving: {
        health: 2,
        points: 300,
        material: 'standard',
        color: 0x00ffff,
        specialEffect: 'trail'
    }
};
