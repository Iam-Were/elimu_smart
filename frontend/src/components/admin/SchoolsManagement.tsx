import React, { useState, useEffect, useCallback } from 'react';
import { getParse } from '@/config/parse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Building2, Users, Crown, Copy, CheckCircle2 } from 'lucide-react';

interface School {
  id: string;
  name: string;
  code: string;
  county: string;
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  seatLimit: number;
  isActive: boolean;
  createdAt: string;
}

interface SchoolStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isPremium: boolean;
  parentConsentGiven: boolean;
}

interface LicenseStatus {
  seatLimit: number;
  totalStudents: number;
  premiumStudents: number;
  seatsRemaining: number | null;
}

const SCHOOL_TYPES = ['public', 'private', 'national', 'county', 'sub-county'];

const defaultForm = { name: '', county: '', type: 'public', contactName: '', contactEmail: '', contactPhone: '', seatLimit: '0' };

export const SchoolsManagement: React.FC = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('listSchools', { limit: 100 });
      setSchools(result.schools || []);
    } catch {
      toast({ title: 'Failed to load schools', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const filteredSchools = search
    ? schools.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        (s.county || '').toLowerCase().includes(search.toLowerCase())
      )
    : schools;

  const openSchool = async (school: School) => {
    setSelectedSchool(school);
    setStudents([]);
    setLicenseStatus(null);
    setSheetLoading(true);
    try {
      const Parse = getParse();
      const [studResult, licResult] = await Promise.all([
        Parse.Cloud.run('getSchoolStudents', { schoolId: school.id, limit: 100 }),
        Parse.Cloud.run('getSchoolLicenseStatus', { schoolId: school.id }),
      ]);
      setStudents(studResult.students || []);
      setLicenseStatus(licResult);
    } catch {
      toast({ title: 'Failed to load school details', variant: 'destructive' });
    } finally {
      setSheetLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.county.trim()) {
      toast({ title: 'School name and county are required', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('createSchool', {
        name: form.name.trim(),
        county: form.county.trim(),
        type: form.type,
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        seatLimit: parseInt(form.seatLimit) || 0,
      });
      toast({ title: `School created! Share this code: ${result.code}` });
      setShowCreateDialog(false);
      setForm(defaultForm);
      fetchSchools();
    } catch (err: unknown) {
      toast({ title: 'Failed to create school', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => null);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalSeats = schools.reduce((sum, s) => sum + (s.seatLimit || 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Licenses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage school accounts and student tagging codes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add School
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Schools</p>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Seat Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{totalSeats > 0 ? totalSeats.toLocaleString() : '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{schools.filter(s => s.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Search by name, code or county..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-sm h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading schools...</div>
          ) : filteredSchools.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              {search ? 'No schools match your search' : 'No schools yet — click Add School to get started'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map(school => (
                  <TableRow
                    key={school.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => openSchool(school)}
                  >
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{school.code}</code>
                        <button
                          onClick={e => { e.stopPropagation(); copyCode(school.code); }}
                          className="text-gray-400 hover:text-gray-600 p-0.5"
                          aria-label="Copy code"
                        >
                          {copiedCode === school.code
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{school.county}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">{school.type}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {school.seatLimit > 0 ? school.seatLimit : 'Unlimited'}
                    </TableCell>
                    <TableCell>
                      <Badge className={school.isActive ? 'bg-green-100 text-green-700 border-green-200 text-xs' : 'bg-gray-100 text-gray-500 text-xs'}>
                        {school.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* School Detail Sheet */}
      <Sheet open={!!selectedSchool} onOpenChange={open => { if (!open) { setSelectedSchool(null); setStudents([]); setLicenseStatus(null); } }}>
        <SheetContent className="w-full sm:max-w-[580px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg">{selectedSchool?.name}</SheetTitle>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{selectedSchool?.code}</code>
              <button
                onClick={() => selectedSchool && copyCode(selectedSchool.code)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Copy code"
              >
                {copiedCode === selectedSchool?.code
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4" />}
              </button>
              <span className="text-xs text-gray-400">Share with teachers to tag students</span>
            </div>
          </SheetHeader>

          {sheetLoading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading details...</div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* License Stats */}
              {licenseStatus && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">License Usage</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-gray-900">{licenseStatus.totalStudents}</p>
                        <p className="text-xs text-gray-500 mt-1">Tagged</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-green-700">{licenseStatus.premiumStudents}</p>
                        <p className="text-xs text-gray-500 mt-1">Premium</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-purple-700">
                          {licenseStatus.seatLimit > 0 ? licenseStatus.seatLimit : '∞'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Seat Limit</p>
                      </div>
                    </div>
                    {licenseStatus.seatLimit > 0 && (
                      <div className="space-y-1">
                        <Progress
                          value={Math.min(100, (licenseStatus.premiumStudents / licenseStatus.seatLimit) * 100)}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-400 text-right">
                          {licenseStatus.seatsRemaining} seats remaining
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Students Table */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Students ({students.length})
                </h3>
                {students.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center border border-dashed rounded-lg">
                    No students tagged yet. Share the school code with teachers.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Consent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="py-2">
                            <p className="text-sm font-medium">{s.firstName} {s.lastName}</p>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </TableCell>
                          <TableCell className="py-2">
                            {s.isPremium
                              ? <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Premium</Badge>
                              : <span className="text-xs text-gray-400">Free</span>}
                          </TableCell>
                          <TableCell className="py-2">
                            {s.parentConsentGiven
                              ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                              : <span className="text-xs text-amber-500">Pending</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create School Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={open => { setShowCreateDialog(open); if (!open) setForm(defaultForm); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label htmlFor="school-name">School Name *</Label>
              <Input
                id="school-name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Alliance High School"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="school-county">County *</Label>
              <Input
                id="school-county"
                value={form.county}
                onChange={e => setForm(f => ({ ...f, county: e.target.value }))}
                placeholder="e.g. Nairobi"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_TYPES.map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input
                id="contact-name"
                value={form.contactName}
                onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                placeholder="Principal / IT Admin"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.contactEmail}
                onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                placeholder="admin@school.ac.ke"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                value={form.contactPhone}
                onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                placeholder="0712 345 678"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="seat-limit">
                Seat Limit <span className="text-gray-400 font-normal">(0 = unlimited)</span>
              </Label>
              <Input
                id="seat-limit"
                type="number"
                min="0"
                value={form.seatLimit}
                onChange={e => setForm(f => ({ ...f, seatLimit: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create School'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
