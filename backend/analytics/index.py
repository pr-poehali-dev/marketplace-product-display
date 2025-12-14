import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Трекинг посещений страниц и получение статистики
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Visitor-Fingerprint',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        if method == 'POST':
            # Трекинг посещения
            body_data = json.loads(event.get('body', '{}'))
            page_path = body_data.get('page_path', '/')
            visitor_fingerprint = body_data.get('visitor_fingerprint', '')
            visitor_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
            user_agent = event.get('headers', {}).get('user-agent', '')
            admin_fingerprint = body_data.get('admin_fingerprint', '')
            
            # Не трекаем админа
            if visitor_fingerprint and visitor_fingerprint != admin_fingerprint:
                cursor.execute("""
                    INSERT INTO page_visits (page_path, visitor_fingerprint, visitor_ip, user_agent)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (page_path, visitor_fingerprint) 
                    DO UPDATE SET visited_at = CURRENT_TIMESTAMP
                """, (page_path, visitor_fingerprint, visitor_ip, user_agent))
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            # Получение статистики
            params = event.get('queryStringParameters') or {}
            page_path = params.get('page_path')
            admin_fingerprint = params.get('admin_fingerprint', '')
            
            if page_path:
                # Статистика для конкретной страницы (без админа)
                cursor.execute("""
                    SELECT COUNT(DISTINCT visitor_fingerprint) as unique_visitors
                    FROM page_visits 
                    WHERE page_path = %s AND visitor_fingerprint != %s
                """, (page_path, admin_fingerprint))
                result = cursor.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'page_path': page_path,
                        'unique_visitors': result[0] if result else 0
                    }),
                    'isBase64Encoded': False
                }
            else:
                # Общая статистика по всем страницам (без админа)
                cursor.execute("""
                    SELECT 
                        page_path, 
                        COUNT(DISTINCT visitor_fingerprint) as unique_visitors,
                        MAX(visited_at) as last_visit
                    FROM page_visits
                    WHERE visitor_fingerprint != %s
                    GROUP BY page_path
                    ORDER BY unique_visitors DESC
                """, (admin_fingerprint,))
                
                rows = cursor.fetchall()
                stats = [
                    {
                        'page_path': row[0],
                        'unique_visitors': row[1],
                        'last_visit': row[2].isoformat() if row[2] else None
                    }
                    for row in rows
                ]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'stats': stats}),
                    'isBase64Encoded': False
                }
    
    finally:
        cursor.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
