import { createClient } from '@/lib/supabase';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  industry: string;
  salary_range?: string;
  skills?: string;
  description: string;
  benefits?: string;
  created_at: string;
  user_id: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  industry: string;
  salary_range?: string;
  skills?: string;
  description: string;
  benefits?: string;
}

export class JobService {
  // Fetch all jobs
  static async getJobs(): Promise<Job[]> {
    try {
      console.log('🔍 JobService.getJobs() - Starting fetch');
      const response = await fetch('/api/jobs');
      console.log('🔍 JobService.getJobs() - Response status:', response.status);
      console.log('🔍 JobService.getJobs() - Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 JobService.getJobs() - Error response:', errorText);
        throw new Error(`Failed to fetch jobs: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('🔍 JobService.getJobs() - Data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  // Create a new job
  static async createJob(jobData: CreateJobData): Promise<Job> {
    try {
      console.log('🔍 JobService.createJob() - Starting job creation');
      const supabase = createClient();
      
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('🔍 JobService.createJob() - User data:', user?.email || 'No user');
      console.log('🔍 JobService.createJob() - User error:', userError);
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('🔍 JobService.createJob() - Creating job for user:', user.email);
      console.log('🔍 JobService.createJob() - Job data:', jobData);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      console.log('🔍 JobService.createJob() - Response status:', response.status);
      console.log('🔍 JobService.createJob() - Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 JobService.createJob() - API Error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to create job');
        } catch {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('🔍 JobService.createJob() - Success:', result);
      return result;
    } catch (error) {
      console.error('🔍 JobService.createJob() - Error:', error);
      throw error;
    }
  }

  // Get jobs by current user
  static async getUserJobs(): Promise<Job[]> {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const allJobs = await response.json();
      return allJobs.filter((job: Job) => job.user_id === user.id);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
      throw error;
    }
  }
}
