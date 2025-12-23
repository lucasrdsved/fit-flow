# Project Backlog & Roadmap

## 🚀 High Priority (Next Steps)

### 1. Trainer Dashboard - Student Management
**Goal:** Enable Personal Trainers to invite and manage students.
- [ ] **Track:** `student_management`
- [ ] Create "New Student" Modal/Page for Trainers.
- [ ] Implement Supabase Edge Function (or client-side logic) to create a user account (invite flow).
- [ ] List all students associated with the logged-in Trainer.
- [ ] View Student Details (Profile, Stats).

### 2. Student Onboarding Flow
**Goal:** Handle the "First Access" experience for invited students.
- [ ] **Track:** `student_onboarding`
- [ ] Create "Complete Profile" page (Password setup, basic info).
- [ ] Handle "Update Password" flow from email link.

### 3. Workout Management (The Core)
**Goal:** Allow Trainers to build plans and Students to view them.
- [ ] **Track:** `workout_builder`
- [ ] CRUD Workouts (Create, Read, Update, Delete).
- [ ] Exercise Library (Add/Select exercises).
- [ ] Assign Workouts to Students.

---

## 🔮 Future Features

### Progress Tracking
- [ ] Measurement logging (Weight, Body Fat, etc.).
- [ ] Progress Photos gallery.
- [ ] Charts/Graphs for visual evolution.

### Communication
- [ ] In-app chat or messaging system between Trainer and Student.
- [ ] Feedback/Notes on completed workouts.

### Gamification (Low Priority)
- [ ] Streaks (days worked out in a row).
- [ ] Badges/Achievements.

---

## 🛠 Technical Debt & Improvements
- [ ] **Testing:** Increase coverage for complex flows (Workout Builder).
- [ ] **Performance:** Optimize image loading for exercises/photos.
- [ ] **PWA:** Verify offline capabilities and installability.
