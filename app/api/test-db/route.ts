import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Test 1: Check if jobs table exists
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('count')
      .limit(1);
    
    // Test 2: Check if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    // Test 3: Get actual job count
    const { count: jobCount, error: countError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    
    const results = {
      timestamp: new Date().toISOString(),
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      jobs_table: {
        exists: !jobsError,
        error: jobsError?.message || null,
        count: jobCount || 0
      },
      profiles_table: {
        exists: !profilesError,
        error: profilesError?.message || null
      }
    };
    
    console.log('🔍 Database test results:', results);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('🔍 Database test error:', error);
    return NextResponse.json(
      { 
        error: 'Database test failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
