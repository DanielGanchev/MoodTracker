# Mood Tracker

An intuitive web application for tracking, visualizing, and analyzing emotional well-being over time. Designed with user experience and mental health awareness at its core.

![Mood Tracker Screenshot](https://placeholder-for-screenshot.png)

## Table of Contents

- [Overview](#overview)
- [Navigation Structure](#navigation-structure)
- [Core Services](#core-services)
- [Technical Architecture](#technical-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Mood Tracker empowers users to monitor and analyze their emotional health through daily tracking, insightful visualizations, and comprehensive reporting. The application combines modern web technologies with thoughtful design to create a seamless experience for monitoring mental well-being.

## Navigation Structure

The application features an intuitive navigation system designed for maximum usability:

### Public Navigation

- **Landing Page** - Introduction to the application and its benefits
- **Sign In** - Secure authentication for returning users
- **Sign Up** - New user registration with email verification

### Authenticated Navigation

- **Dashboard** - Overview of recent mood entries and summary statistics
- **Entry Form** - Interface for recording daily mood ratings across multiple dimensions
- **Trends View** - Line graphs showing emotional patterns over time
- **Combined Graphs** - Toggle-enabled visualization for comparing different emotional categories
- **Calendar View** - Monthly calendar displaying mood entry history
- **Settings** - User preference management and account settings
- **PDF Export** - Generation of professional reports for personal records

### Mobile-Responsive Navigation

- **Bottom Navigation Bar** - Quick access to primary functions on mobile devices
- **Slide-out Menu** - Access to secondary features and settings on smaller screens

## Core Services

### User Authentication Service

- Manually registration user in supabase
- Session management

### Mood Entry Service

- Multi-dimensional emotion tracking (happiness, sadness, anger, fear)
- Focus and productivity metrics
- Customizable rating scales (1-10)
- Notes and context recording
- Date/time stamping

### Data Visualization Service

- Time-series emotional trend analysis
- Category comparison through interactive graphs
- Color-coded visualization for intuitive understanding
- Customizable date range selection
- Toggle functionality for focusing on specific emotions

### Data Export Service

- Professional PDF report generation
- Customizable date ranges for reporting
- Tabular data presentation
- Statistical summaries
- Shareable format for healthcare providers

### Data Storage Service

- Secure cloud-based data storage
- User data isolation and protection
- Real-time synchronization
- Data backup and recovery mechanisms

## Technical Architecture

### Frontend Layer

- **Framework**: Next.js with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Visualization**: Chart.js

### Backend Layer

- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **API**: Supabase REST and real-time subscriptions
- **Security**: Row-Level Security policies

### External Services

- **PDF Generation**: jsPDF, jspdf-autotable
- **Date Handling**: date-fns

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/mood-tracker.git
cd mood-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

## Configuration

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key


### Supabase Setup

1. Create a new Supabase project
2. Configure authentication providers
3. Set up Row-Level Security policies

## API Reference

### Authentication Endpoints

- `POST /api/auth/signin` - User authentication



## Database Schema

```sql
-- Key tables and relationships
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  happiness INTEGER CHECK (happiness BETWEEN 1 AND 10),
  sadness INTEGER CHECK (sadness BETWEEN 1 AND 10),
  anger INTEGER CHECK (anger BETWEEN 1 AND 10),
  fear INTEGER CHECK (fear BETWEEN 1 AND 10),
  focus INTEGER CHECK (focus BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE DEFAULT CURRENT_DATE
);

-- RLS Policies ensure users can only access their own data
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
  ```bash
  vercel --prod
  ```
- **Netlify**: Alternative deployment option
  ```bash
  netlify deploy --prod
  ```

### CI/CD Pipeline

The repository includes GitHub Actions workflows for:

- Automated testing
- Linting
- Production deployment



_Mood Tracker - Empowering emotional self-awareness through technology_
