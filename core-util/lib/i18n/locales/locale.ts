export interface Locale {
  core?: {
    period?: {
      days?: string,
      hours?: string,
      minutes?: string,
      months?: string,
      seconds?: string,
      years?: string
    },
    pipe?: {
      distanceInWords?: {
        yesterday?: string,
        today?: string,
        days?: string,
        weeks?: string,
        months?: string,
        year?: string,
      }
    }
  }
}
