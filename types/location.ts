export interface LocationCreation {
    name?: string
    country: string
    city: string
}

export interface Location extends LocationCreation {
    id: string
    createdAt?: string
}

export interface LocationPagination {
    locations: Location[]
    total: number
}

export interface LocationFiltering {
    name?: string
    country?: string
    city?: string
}
