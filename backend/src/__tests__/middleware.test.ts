import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const makeReq = (overrides: Partial<Request> = {}): Request =>
  ({ headers: {}, ...overrides } as unknown as Request);

const makeRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── authenticate ─────────────────────────────────────────────────────────────

describe('authenticate middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  it('returns 401 when Authorization header is missing', () => {
    const res = makeRes();
    authenticate(makeReq(), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token format is wrong (no Bearer prefix)', () => {
    const res = makeRes();
    authenticate(
      makeReq({ headers: { authorization: 'Token abc' } } as any),
      res,
      next,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for an invalid / malformed token', () => {
    const res = makeRes();
    authenticate(
      makeReq({ headers: { authorization: 'Bearer invalid.token.here' } } as any),
      res,
      next,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for a token signed with a wrong secret', () => {
    const token = jwt.sign({ userId: 1, role: 'USER' }, 'wrong_secret');
    const res = makeRes();
    authenticate(
      makeReq({ headers: { authorization: `Bearer ${token}` } } as any),
      res,
      next,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.userId and req.userRole and calls next() for valid USER token', () => {
    const token = jwt.sign({ userId: 1, role: 'USER' }, 'fallback_secret');
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } } as any) as any;
    const res = makeRes();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.userId).toBe(1);
    expect(req.userRole).toBe('USER');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('sets req.userId and req.userRole and calls next() for valid ADMIN token', () => {
    const token = jwt.sign({ userId: 42, role: 'ADMIN' }, 'fallback_secret');
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } } as any) as any;
    const res = makeRes();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.userId).toBe(42);
    expect(req.userRole).toBe('ADMIN');
  });

  it('returns 401 for an expired token', () => {
    const token = jwt.sign({ userId: 1, role: 'USER' }, 'fallback_secret', {
      expiresIn: -1,
    });
    const res = makeRes();
    authenticate(
      makeReq({ headers: { authorization: `Bearer ${token}` } } as any),
      res,
      next,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

// ─── requireAdmin ─────────────────────────────────────────────────────────────

describe('requireAdmin middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  it('returns 403 when userRole is USER', () => {
    const req = { userRole: 'USER' } as any;
    const res = makeRes();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when userRole is undefined', () => {
    const req = {} as any;
    const res = makeRes();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when userRole is an arbitrary non-admin string', () => {
    const req = { userRole: 'MODERATOR' } as any;
    const res = makeRes();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when userRole is ADMIN', () => {
    const req = { userRole: 'ADMIN' } as any;
    const res = makeRes();
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
