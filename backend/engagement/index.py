import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление лайками и комментариями к статьям
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Visitor-Fingerprint',
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
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'comments')
        
        # === ЛАЙКИ ===
        if action == 'like' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('article_id')
            visitor_fingerprint = body_data.get('visitor_fingerprint', '')
            
            if not article_id or not visitor_fingerprint:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id and visitor_fingerprint required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                INSERT INTO article_likes (article_id, visitor_fingerprint)
                VALUES (%s, %s)
                ON CONFLICT (article_id, visitor_fingerprint) DO NOTHING
                RETURNING id
            """, (article_id, visitor_fingerprint))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'liked': result is not None}),
                'isBase64Encoded': False
            }
        
        elif action == 'unlike' and method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('article_id')
            visitor_fingerprint = body_data.get('visitor_fingerprint', '')
            
            if not article_id or not visitor_fingerprint:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id and visitor_fingerprint required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                DELETE FROM article_likes 
                WHERE article_id = %s AND visitor_fingerprint = %s
            """, (article_id, visitor_fingerprint))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'likes' and method == 'GET':
            article_id = params.get('article_id')
            visitor_fingerprint = params.get('visitor_fingerprint', '')
            
            if not article_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id required'}),
                    'isBase64Encoded': False
                }
            
            # Общее количество лайков
            cursor.execute("""
                SELECT COUNT(*) FROM article_likes WHERE article_id = %s
            """, (article_id,))
            total_likes = cursor.fetchone()[0]
            
            # Проверка, лайкнул ли текущий пользователь
            user_liked = False
            if visitor_fingerprint:
                cursor.execute("""
                    SELECT EXISTS(
                        SELECT 1 FROM article_likes 
                        WHERE article_id = %s AND visitor_fingerprint = %s
                    )
                """, (article_id, visitor_fingerprint))
                user_liked = cursor.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'total_likes': total_likes,
                    'user_liked': user_liked
                }),
                'isBase64Encoded': False
            }
        
        # === КОММЕНТАРИИ ===
        elif action == 'comments' and method == 'GET':
            article_id = params.get('article_id')
            
            if not article_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                SELECT id, author_name, content, created_at
                FROM article_comments
                WHERE article_id = %s
                ORDER BY created_at DESC
            """, (article_id,))
            
            rows = cursor.fetchall()
            comments = [
                {
                    'id': row[0],
                    'author_name': row[1],
                    'content': row[2],
                    'created_at': row[3].isoformat() if row[3] else None
                }
                for row in rows
            ]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'comments': comments}),
                'isBase64Encoded': False
            }
        
        elif action == 'comment' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('article_id')
            author_name = body_data.get('author_name', 'Аноним')
            author_email = body_data.get('author_email')
            content = body_data.get('content', '')
            visitor_fingerprint = body_data.get('visitor_fingerprint', '')
            
            if not article_id or not content.strip():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id and content required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                INSERT INTO article_comments 
                (article_id, author_name, author_email, content, visitor_fingerprint)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, created_at
            """, (article_id, author_name, author_email, content, visitor_fingerprint))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'comment_id': result[0],
                    'created_at': result[1].isoformat() if result[1] else None
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'comment' and method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            comment_id = body_data.get('comment_id')
            
            if not comment_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'comment_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("DELETE FROM article_comments WHERE id = %s", (comment_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
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
