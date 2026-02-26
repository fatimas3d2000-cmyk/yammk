import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Use the fresh SQL file that completely resets and recreates policies
    const sqlPath = join(process.cwd(), 'lib', 'rls-policies-fresh.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    return Response.json({
      success: true,
      sql: sql,
      message: 'تم تحميل السياسات بنجاح'
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: (error instanceof Error ? error.message : 'Unknown error'),
      message: 'فشل تحميل ملف السياسات'
    }, { status: 500 })
  }
}
