# logistic_adaptive. theta=[.35,.45,.15], theta_hat={1,.1,2}

library(expm) # used, e.g. for sqrtm

nmax1=15000
xdim = 3
xmin = c(350/100,20000/10000,250/100)
xmu =  c(500/100,40000/10000,750/100)

xstd = c(.4,.4,.4)
theta = c(.25,.25,.25)
theta_hat = c(.1,.1,.1)

last_theta = vector("numeric",xdim)
sumterm = vector("numeric",xdim)
x = matrix(0,nrow=nmax1,ncol=xdim)
corr = matrix(0,nrow=xdim,ncol=xdim)
corrsr = matrix(0,nrow=xdim,ncol=xdim)
v = c(rep(0,xdim))
w = c(rep(0,xdim))
xtemp = c(rep(0,xdim))
lambda = c(rep(0,nmax1))
lambda0 = c(rep(0,nmax1))
lambda1 = c(rep(0,nmax1))
y = c(rep(0,nmax1))

alpha = .005
corr[1,2]=.6
corr[1,3]=.5
corr[2,3]=.7
for (i in 1:xdim) {
  corr[i,i] = 1
  for (j in 1:xdim) {
    corr[i,j] - corr[j,i]
  }
}
corrsr = sqrtm(corr)

#************************************************************
# Section 1: Generate sample training set.
# x[i,j]=jth attribute of ith observation
# lambda(i)=logist response to x[i,:], viewed as "score" 
# y[i]=:1 if rpois(lambda(i)) > 0
# indk/nmax = Prob{simulated y = k}, k={0,1}, ind0+ind1=nmax
# mean(lambda1[1:ind1])=ave "score" of defaulted vectors
# mean(lambda0[1:ind0])=ave "score" of non-defaulted vectors

ind0=0
ind1=0
# Generate Sample Training Set

i=0
while( i < nmax1) {
  for (j in 1:xdim) {
    v[j]=rnorm(1)
  }
  w = (corrsr %*% v)
  
  bad=0
  htheta_sim=0
  for (j in 1:xdim) {
    xtemp[j] = (xstd[j]*w[j] + 1 )*xmu[j]            
    if ( xtemp[j] < 0) {bad=1}                       
  }
  if (bad==0) {
    i=i+1
    for (j in 1:xdim) {
      x[i,j] = xtemp[j]
      htheta_sim = htheta_sim + xtemp[j]*theta[j]    
    }
    lambda[i] = 2 - (2/(1 + exp(-1*htheta_sim)) )    
  }                                                  
} 

nmax=i
for (i in 1:nmax) {
  df = rpois(1,lambda[i])
  if (df>0) {
    y[i]=1
    ind1=ind1+1
    lambda1[ind1]=lambda[i]
  }
  else {
    y[i]=0
    ind0=ind0+1
    lambda0[ind0]=lambda[i]
  }
}

#***********************************************************
# Begin training vis SGM
# htheta = logist response (given theta_hat) to training vector
# update theta_hat until training set exhausted
# err1 and err2 measure CONVERGENCE performance

err2 = c(rep(0,xdim))
err1 = 0
# count=0

for (i in 1:nmax) {
  last_theta = theta_hat
  htheta = 0
  for (j in 1:xdim) {
    htheta = htheta + theta_hat[j]*x[i,j]
  }
  htheta = 2 - ( 2/(1 + exp(-1*htheta)) )
  tempvar = (htheta*(2 - htheta))/(1-htheta)
  
  for (j in 1:xdim) {
    sumterm[j] = (tempvar - y[i]*(2-htheta + tempvar) ) * x[i,j]*0.5
    theta_hat[j] = theta_hat[j] + alpha * sumterm[j]
  }
  err2 = theta_hat - last_theta
  err1 = sqrt(err2[1]^2 + err2[2]^2 + err2[3]^2 )
}

#***************************************************************
# Compute error between estimator yhat and test data ytest
# 1) Generate test vector xtest[i,j], logist resp lambdatest(xtest,theta)
#    generate test target: ytest[i]=1 if rpois(lambdatest) > 0
# 2) Generate estimator yhat as follows: yhat[i]=logist_resp(xtest,theta_hat)
# Then quantize yhat to {0,1}: yhat=: indicator { yhat[i] > threshold }
# NOTE: Reject if yhat=1. If ytest=0 then FN (rejected good)
#       Accept if yhat=0. If ytest=1 then FP (accepted bad)
# estat = rms of ytest vs. yhat (BOTH BINARY). Also, rms_fp, rms_fn
# estat_lambda = rms of logistic responses. lambdatest vs. yhat (before quantizing) 


xtest = matrix(0,nrow=nmax1,ncol=xdim)
lambdatest = c(rep(0,nmax1))
ytest = c(rep(0,nmax1))
yhat = c(rep(0,nmax1))
estat = c(rep(0,xdim))
estat_lambda = c(rep(0,xdim))

threshold=0.07
i=0
while ( i < nmax1) {
  for (j in 1:xdim) {
    v[j]=rnorm(1)
  }
  w = (corrsr %*% v)
  
  bad=0
  htheta_test=0
  htheta_hat=0
  for (j in 1:xdim) {
    xtemp[j] = (xstd[j]*w[j] + 1 )*xmu[j]            
    if ( xtemp[j] < 0) {bad=1}                       
  }
  if (bad==0) {
    i=i+1
    for (j in 1:xdim) {
      xtest[i,j] = xtemp[j]
      htheta_test = htheta_test + xtemp[j]*theta[j] 
      htheta_hat = htheta_hat + xtemp[j]*theta_hat[j]
    }
    lambdatest[i] = 2 - (2/(1 + exp(-1*htheta_test)) )
    yhat[i] = 2 - (2/(1 + exp(-1*htheta_hat)) )
  }
}  

nmax=i
rms_fp=0
rms_fn=0
rms=0
rms_lambda=0
rms_lambda_fp = 0
rms_lambda_fn = 0
rejcount=0

for (i in 1:nmax) {
  df = rpois(1,lambdatest[i])
  if (df>0) {
    ytest[i]=1
  }
  else {
    ytest[i]=0
  }
  rms_lambda = rms_lambda + (lambdatest[i]-yhat[i])^2
  if (yhat[i]>threshold) {
    rms_lambda_fn = rms_lambda_fn + (lambdatest[i]-yhat[i])^2
    yhat[i]=1
    rms_fn = rms_fn + ( ytest[i] - yhat[i] )^2
    rejcount=rejcount+1
  }
  else {
    rms_lambda_fp = rms_lambda_fp + (lambdatest[i]-yhat[i])^2
    yhat[i]=0
    rms_fp = rms_fp + ( ytest[i] - yhat[i] )^2
  }
  rms = rms + ( ytest[i] - yhat[i] )^2
}

estat[1] = rms/nmax
estat[2] = rms_fn/rejcount
estat[3] = rms_fp/(nmax-rejcount)
estat_lambda[1] = rms_lambda/nmax
estat_lambda[2] = rms_lambda_fn/rejcount
estat_lambda[3] = rms_lambda_fp/(nmax-rejcount)

