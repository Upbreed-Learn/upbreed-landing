'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileType } from '@/lib/constants';
import { https } from '@/lib/https';
import { useGetToken, useGetUserProfile } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { apiError } from '@/lib/sessions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Country, State } from 'country-state-city';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type Form = {
  fname: string;
  lname: string;
  phone: string;
  country: string; // ISO code while editing; saved as the country name
  state: string; // state name
  websiteLink: string;
  instagramLink: string;
  xLink: string;
  linkedinLink: string;
  tiktokLink: string;
};

const LINKS: { key: keyof Form; label: string; placeholder: string }[] = [
  { key: 'websiteLink', label: 'Website', placeholder: 'yourwebsite.com' },
  { key: 'instagramLink', label: 'Instagram', placeholder: 'instagram.com/yourname' },
  { key: 'xLink', label: 'X', placeholder: 'x.com/yourname' },
  { key: 'linkedinLink', label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname' },
  { key: 'tiktokLink', label: 'TikTok', placeholder: 'tiktok.com/@yourname' },
];

/** "instagram.com/me" → "https://instagram.com/me"; empty stays empty. */
const asUrl = (v: string) => {
  const t = v.trim();
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};
const looksLikeUrl = (v: string) => {
  if (!v.trim()) return true;
  try {
    const u = new URL(asUrl(v));
    return u.hostname.includes('.');
  } catch {
    return false;
  }
};

const countries = Country.getAllCountries();

function fromProfile(p?: UserProfileType): Form {
  const up = p?.userProfile;
  const iso = countries.find(c => c.name === up?.country || c.isoCode === up?.country)?.isoCode ?? '';
  return {
    fname: p?.fname ?? '',
    lname: p?.lname ?? '',
    phone: p?.phone ?? '',
    country: iso,
    state: up?.state ?? '',
    websiteLink: up?.websiteLink ?? '',
    instagramLink: up?.instagramLink ?? '',
    xLink: up?.xLink ?? '',
    linkedinLink: up?.linkedinLink ?? '',
    tiktokLink: up?.tiktokLink ?? '',
  };
}

const label = 'text-xs font-semibold text-[#474747]';
const input = 'h-10 border-none bg-[#F2F2F2] text-sm';

const Profile = () => {
  const qc = useQueryClient();
  const { data } = useGetToken();
  const { data: userData } = useGetUserProfile(data?.data.token);
  const profile: UserProfileType | undefined = userData?.data.data;
  const [form, setForm] = useState<Form>(() => fromProfile(profile));
  useEffect(() => setForm(fromProfile(profile)), [profile]);
  const set = (k: keyof Form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const states = useMemo(() => (form.country ? State.getStatesOfCountry(form.country) : []), [form.country]);
  const badLinks = LINKS.filter(l => !looksLikeUrl(form[l.key]));
  const nameOk = form.fname.trim().length > 0 && form.lname.trim().length > 0;

  const save = useMutation({
    mutationFn: () =>
      https.patch('/user/profile', {
        fname: form.fname.trim(),
        lname: form.lname.trim(),
        phone: form.phone.trim(),
        country: countries.find(c => c.isoCode === form.country)?.name ?? '',
        state: form.state,
        ...Object.fromEntries(LINKS.map(l => [l.key, asUrl(form[l.key])])),
      }),
    onSuccess: () => {
      toast.success('Profile saved');
      qc.invalidateQueries({ queryKey: queryKeys.userProfile.all });
    },
    onError: e => toast.error('Could not save', { description: apiError(e) }),
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (nameOk && !badLinks.length) save.mutate();
      }}
      className="flex w-full flex-col gap-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={label}>First name *</span>
          <Input className={input} value={form.fname} maxLength={100} onChange={e => set('fname', e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Last name *</span>
          <Input className={input} value={form.lname} maxLength={100} onChange={e => set('lname', e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Email</span>
          <Input className={`${input} text-[#9B9B9B]`} value={profile?.email ?? ''} disabled />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Phone</span>
          <Input className={input} value={form.phone} maxLength={30} placeholder="Optional" onChange={e => set('phone', e.target.value)} />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className={label}>Country</span>
          <Select
            value={form.country}
            onValueChange={v => setForm(f => ({ ...f, country: v, state: '' }))}
          >
            <SelectTrigger className="h-10! w-full border-none bg-[#F2F2F2] text-sm">
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {countries.map(c => (
                <SelectItem key={c.isoCode} value={c.isoCode}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={label}>State</span>
          <Select value={form.state} onValueChange={v => set('state', v)} disabled={!states.length}>
            <SelectTrigger className="h-10! w-full border-none bg-[#F2F2F2] text-sm">
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {states.map(s => (
                <SelectItem key={s.isoCode} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="border-b border-[#E5E5E5] pb-2 text-sm font-semibold">
          Links <span className="font-normal text-[#9B9B9B]">(all optional)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKS.map(l => {
            const bad = !looksLikeUrl(form[l.key]);
            return (
              <label key={l.key} className="flex flex-col gap-1.5">
                <span className={label}>{l.label}</span>
                <Input
                  className={input}
                  value={form[l.key]}
                  maxLength={290}
                  placeholder={l.placeholder}
                  aria-invalid={bad}
                  onChange={e => set(l.key, e.target.value)}
                />
                {bad && <span className="text-xs text-red-600">This doesn&apos;t look like a web address</span>}
              </label>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="w-max px-8" disabled={!nameOk || badLinks.length > 0 || save.isPending}>
        {save.isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
};

export default Profile;
