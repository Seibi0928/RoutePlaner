module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "moduleNameMapper": {
        "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
    },
    "snapshotSerializers": ["enzyme-to-json/serializer"],
    "setupFilesAfterEnv": ["<rootDir>/src/test/setupEnzyme.ts"],
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "reporters": [
        "default",
        [
            "jest-junit",
            {
                "suiteName": "jest tests",
                "classNameTemplate": "{classname}-{title}",
                "titleTemplate": "{classname}-{title}",
                "ancestorSeparator": " › "
            }
        ]

    ],
    "coverageReporters": [
        "text",
        "html",
        "cobertura"
    ]
};
