# startingpoint
Startingpoint is a tool to build itineraries everywhere, anywhere, easily. From manual, by hand, to the use of a simple prompt, this tool serves everyone.


## Domain

### Trip [Aggregate]

    Trip [Root]
     ├── Id
     ├── Name
     ├── Destination
     ├── StartDate
     ├── EndDate
     └── POIs
    
    POI
     ├── Id
     ├── TripId
     ├── Name
     ├── Description
     ├── CategoryId
     ├── Address
     └── Notes
    
    POICategory [Enum]
     ├── Id
     └── Name
