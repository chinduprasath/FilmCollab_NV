import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET /api/jobs - Fetch all jobs
export async function GET() {
  try {
    console.log('🔍 GET /api/jobs - Starting request');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    console.log('🔍 Supabase client created');
    
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('🔍 Database query completed');
    console.log('🔍 Jobs data:', jobs);
    console.log('🔍 Error:', error);

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs', details: error.message },
        { status: 500 }
      );
    }

    console.log('🔍 Returning jobs:', jobs?.length || 0);
    return NextResponse.json(jobs || []);
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/jobs - Starting request');
    
    // Create server-side Supabase client with cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    console.log('🔍 Supabase server client created');
    
    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('🔍 User data:', user?.email || 'No user');
    console.log('🔍 Auth error:', authError);
    
    if (authError || !user) {
      console.log('🔍 Authentication failed - no valid user session');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'No valid user session' },
        { status: 401 }
      );
    }

    console.log('🔍 User authenticated successfully:', user.email);

    // Parse the request body
    const body = await request.json();
    const {
      title,
      company,
      location,
      job_type,
      experience_level,
      industry,
      salary_range,
      skills,
      description,
      benefits
    } = body;

    // Validate required fields
    if (!title || !company || !location || !job_type || !experience_level || !industry || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert the job into the database
    console.log('🔍 Inserting job with data:', {
      title,
      company,
      location,
      job_type,
      experience_level,
      industry,
      salary_range,
      skills,
      description,
      benefits,
      user_id: user.id
    });
    
    const { data: job, error: insertError } = await supabase
      .from('jobs')
      .insert({
        title,
        company,
        location,
        job_type,
        experience_level,
        industry,
        salary_range,
        skills,
        description,
        benefits,
        user_id: user.id
      })
      .select()
      .single();

    console.log('🔍 Database insert completed');
    console.log('🔍 Insert error:', insertError);
    console.log('🔍 Created job:', job);

    if (insertError) {
      console.error('🔍 Error inserting job:', insertError);
      return NextResponse.json(
        { error: 'Failed to create job', details: insertError.message },
        { status: 500 }
      );
    }

    console.log('🔍 Job created successfully:', job);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('🔍 Error in POST /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
