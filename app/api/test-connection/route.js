import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    // Simple test - just try to fetch one record from patients table
    const { count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 200 }
      )
    }

    return Response.json({
      success: true,
      message: 'تم الاتصال بنجاح',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { success: false, error: errorMessage },
      { status: 200 }
    )
  }
}
