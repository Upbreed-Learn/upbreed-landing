'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { deleteToken } from '@/lib/actions';
import { https, resetTokenCache } from '@/lib/https';
import { apiError } from '@/lib/sessions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, LogOut, Monitor, ShieldCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type Device = { id: number; label: string; lastLogin: string; firstSeen: string; current: boolean };

const when = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
const card = 'flex flex-col gap-4 rounded-xl border border-[#E5E5E5] p-5 sm:p-6';

/** Settings › Privacy: the person's own data controls (the full policy lives at /privacy). */
const Privacy = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Privacy</h1>
      <p className="text-sm text-[#737373]">
        Your data, your choice. Download a copy, see where you&apos;re signed in, or delete your account. Read how we handle your data in our{' '}
        <Link href="/privacy" className="text-[#305B43] underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
    <ExportData />
    <Devices />
    <Emails />
    <DeleteAccount />
  </div>
);

function ExportData() {
  const download = useMutation({
    mutationFn: () => https.get('/user/me/export', { responseType: 'blob' }).then(r => r.data as Blob),
    onSuccess: blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upbreed-my-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success('Your data is downloading');
    },
    onError: e => toast.error('Could not prepare your data', { description: apiError(e) }),
  });
  return (
    <section className={card}>
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 size-5 shrink-0 text-[#305B43]" />
        <div>
          <p className="font-semibold">Download my data</p>
          <p className="text-sm text-[#737373]">
            A file with your account, profile, memberships, payments, course progress, bookings and reviews. Your password is never included.
          </p>
        </div>
      </div>
      <Button variant="outline" className="w-max" disabled={download.isPending} onClick={() => download.mutate()}>
        {download.isPending ? 'Preparing…' : 'Download my data'}
      </Button>
    </section>
  );
}

function Devices() {
  const qc = useQueryClient();
  const devices = useQuery({ queryKey: ['my-devices'], queryFn: () => https.get('/user/me/devices').then(r => r.data.data as Device[]) });
  const others = (devices.data ?? []).filter(d => !d.current).length;
  const signOut = useMutation({
    mutationFn: () => https.post('/user/me/devices/sign-out-others').then(r => r.data.message as string),
    onSuccess: msg => {
      toast.success(msg);
      qc.invalidateQueries({ queryKey: ['my-devices'] });
    },
    onError: e => toast.error('Could not sign out other devices', { description: apiError(e) }),
  });
  return (
    <section className={card}>
      <div className="flex items-start gap-3">
        <Monitor className="mt-0.5 size-5 shrink-0 text-[#305B43]" />
        <div>
          <p className="font-semibold">Where you&apos;re signed in</p>
          <p className="text-sm text-[#737373]">If you don&apos;t recognise a device, sign it out and change your password.</p>
        </div>
      </div>
      {devices.isPending ? (
        <div className="h-16 animate-pulse rounded-lg bg-[#F2F2F2]" />
      ) : (
        <ul className="flex flex-col divide-y divide-[#EEE] text-sm">
          {devices.data?.map(d => (
            <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="font-medium">
                {d.current ? 'This device' : d.label}
                {d.current && <span className="ml-2 rounded-full bg-[#E8F0E4] px-2 py-0.5 text-[10px] font-semibold text-[#305B43]">Current</span>}
              </span>
              <span className="text-xs text-[#737373]">Last signed in {when(d.lastLogin)}</span>
            </li>
          ))}
        </ul>
      )}
      <Button variant="outline" className="w-max" disabled={!others || signOut.isPending} onClick={() => signOut.mutate()}>
        <LogOut className="size-4" />
        {signOut.isPending ? 'Signing out…' : others ? `Sign out ${others} other device${others > 1 ? 's' : ''}` : 'No other devices'}
      </Button>
    </section>
  );
}

function Emails() {
  return (
    <section className={card}>
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#305B43]" />
        <div>
          <p className="font-semibold">Emails</p>
          <p className="text-sm text-[#737373]">
            We only send emails you need: sign-in codes, receipts, membership reminders and 1-on-1 booking updates. If you sign up for our
            newsletter, every one has an unsubscribe link.
          </p>
        </div>
      </div>
    </section>
  );
}

function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState('');
  const del = useMutation({
    mutationFn: () => https.post('/user/me/delete', { password: secret, confirm: secret.trim() }),
    onSuccess: async () => {
      await deleteToken();
      resetTokenCache();
      toast.success('Your account has been deleted');
      window.location.assign('/');
    },
    onError: e => toast.error('Could not delete your account', { description: apiError(e) }),
  });
  return (
    <section className={`${card} border-[#F3C7C3]`}>
      <div className="flex items-start gap-3">
        <Trash2 className="mt-0.5 size-5 shrink-0 text-[#C0392B]" />
        <div>
          <p className="font-semibold text-[#C0392B]">Delete my account</p>
          <p className="text-sm text-[#737373]">
            This permanently removes your profile, progress, bookmarks and reviews, and stops any membership from renewing. We keep payment
            records only as tax law requires, without your name or email. This can&apos;t be undone.
          </p>
        </div>
      </div>
      <Button variant="outline" className="w-max border-[#C0392B] text-[#C0392B] hover:bg-[#C0392B] hover:text-white" onClick={() => setOpen(true)}>
        Delete my account
      </Button>
      <Dialog
        open={open}
        onOpenChange={o => {
          setOpen(o);
          if (!o) setSecret('');
        }}
      >
        <DialogContent className="custom-font text-[#00230F] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              You&apos;ll lose access to your courses straight away, even if your membership hasn&apos;t ended. To confirm, enter your password. If
              you sign in with Google, type <strong>DELETE</strong> instead.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Password, or DELETE"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            className="h-11"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Keep my account
            </Button>
            <Button className="flex-1 bg-[#C0392B] text-white hover:bg-[#A93226]" disabled={!secret || del.isPending} onClick={() => del.mutate()}>
              {del.isPending ? 'Deleting…' : 'Delete forever'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Privacy;
