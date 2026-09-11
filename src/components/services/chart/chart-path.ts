export interface Point {
    x: number;
    y: number;
}

/**
 * Génère un chemin SVG en ligne droite
 */
export function buildLinePath(points: Point[]): string {
    if (points.length === 0) return '';
    return points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
}

/**
 * Génère un chemin SVG lissé (courbe de Bézier)
 */
export function buildSmoothPath(points: Point[], tension: number = 0.3): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
}

/**
 * Génère un chemin fermé pour une zone (area)
 */
export function buildAreaPath(
    points: Point[],
    baseline: number,
    smooth: boolean = false,
    tension: number = 0.3
): string {
    if (points.length === 0) return '';

    const linePath = smooth
        ? buildSmoothPath(points, tension)
        : buildLinePath(points);

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    // Fermer le chemin vers la baseline
    return `${linePath} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`;
}